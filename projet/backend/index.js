const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");

const app = express();
const port = 3000;
const privatekey = "s3cr3t";

app.use(bodyParser.json());
app.use(cors());

const client = new Client();
client.connect(function (err) {
  if (err) throw err;
  console.log("🟢 Connected to database");
});

const checkWizardToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  jwt.verify(token.split(" ")[1], privatekey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.wizard = decoded;
    next();
  });
};

const checkRoleToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  jwt.verify(token.split(" ")[1], privatekey, (err, decoded) => {
    if (err || !decoded.role?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.wizard = decoded;
    next();
  });
};

/**
 * PUBLIC ROUTES
 */
app.get("/staff", (req, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Get all staff members'
  // #swagger.description = 'Public route to view staff members'
  const query = `
    SELECT 
      json_build_object(
        'wizard', wizard.*,
        'subject', subject.*,
        'room', room.*
      ) as data
    FROM Role
      JOIN WizardRole ON Role.id = WizardRole.role_id
      JOIN wizard ON wizard.id = WizardRole.wizard_id
      LEFT JOIN Subject ON subject.wizard_id = wizard.id
      LEFT JOIN Room ON subject.room_id = room.id
    WHERE Role.name != 'student'
    GROUP BY wizard.id, subject.*, room.*
    ORDER BY wizard.firstname, wizard.lastname ASC
  `;
  client
    .query(query)
    .then((result) => {
      res.json(result.rows.map((row) => row.data));
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/me", checkRoleToken, ({ wizard }, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Get all course subjects'
  // #swagger.description = 'Public route'
  res.status(200).json({ wizard });
});


app.get("/subjects", (req, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Get all course subjects'
  // #swagger.description = 'Public route'
  client
    .query("SELECT * FROM subject ORDER BY name ASC")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/subjects/:id", (req, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Get a subject by id'
  // #swagger.description = 'Public route'
  const id = req.params.id;
  client
    .query("SELECT * FROM subject WHERE id=$1", [id])
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/login", (req, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Login'
  // #swagger.description = 'Public route'
  const email = req.body.email;
  const password = req.body.password;
  client
    .query("SELECT * FROM wizard WHERE email=$1 AND password=$2", [
      email,
      password,
    ])
    .then((result) => {
      const wizard = result.rows[0];
      if (wizard) {
        delete wizard.password;
        const token = jwt.sign(wizard, privatekey, { expiresIn: "12h" });
        res.json({
          token,
          wizard,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/nav-links", async (req, res) => {
  // #swagger.tags = ['Public']
  // #swagger.summary  = 'Get navigation links according to access rules'

  const token = req.headers.authorization;

  let decoded = null;
  try {
    if (token) decoded = jwt.verify(token.split(" ")[1], privatekey);

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  let links = [
    { label: "Staff", url: "/staff" },
    { label: "Matières", url: "/subjects" },
  ];

  if (token && decoded?.role?.id) {
    links = [
      ...links,
      { label: "Sorciers", url: "/wizards" },
      { label: "Classes", url: "/classes" },
      { label: "Maisons", url: "/houses" },
      { label: "Salles", url: "/rooms" },
      { label: "Rôles", url: "/roles" },
    ];
  }

  res.json(links);
});

/**
 * WIZARD AUTHENTICATED ROUTES
 */
app.get("/wizard-roles", checkWizardToken, (req, res) => {
  // #swagger.tags = ['Authenticated as wizard']
  // #swagger.summary  = 'Get all roles of a wizard'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const wizard_id = req.wizard.id;
  client
    .query(
      "SELECT Role.* FROM WizardRole JOIN Role ON WizardRole.role_id = Role.id WHERE wizard_id=$1 ORDER BY Role.name",
      [wizard_id]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/login-role", checkWizardToken, (req, res) => {
  // #swagger.tags = ['Authenticated as wizard']
  // #swagger.summary  = 'Select a role for wizard session'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const wizard = req.wizard;
  const role_id = req.body.id;
  const query = `
    SELECT
      json_build_object(
        'role', Role.*,
        'wizard', wizard.*
      ) as data
    FROM WizardRole
      JOIN Role ON WizardRole.role_id = Role.id
      JOIN wizard ON wizard.id = WizardRole.wizard_id
    WHERE wizard_id=$1 AND role_id=$2
  `;
  client
    .query(query, [wizard.id, role_id])
    .then((result) => {
      const data = result.rows[0]?.data;
      if (data) {
        delete data.wizard.password;
        const token = jwt.sign(data, privatekey, { expiresIn: "12h" });
        res.json({
          token,
          ...data,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/**
 * ROLE AUTHENTICATED ROUTES
 */
/* Wizard */
app.get("/wizards", checkRoleToken, (req, res) => {
  // #swagger.tags = ['Wizards']
  // #swagger.summary  = 'Get all wizards'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const query = `
    SELECT
      wizard.*,
      json_agg(role.*) FILTER (WHERE role.id IS NOT NULL) OVER (PARTITION BY wizard.id) as roles
    FROM wizard
    LEFT JOIN WizardRole ON wizard.id = WizardRole.wizard_id
    LEFT JOIN Role ON WizardRole.role_id = Role.id
    ORDER BY wizard.firstname, wizard.lastname ASC
  `;
  client
    .query(query)
    .then((result) => {
      result = result.rows.map((wizard) => {
        delete wizard.password;
        return wizard;
      });
      let unique_wizards = [];
      result.forEach((wizard) => {
        if (!unique_wizards.find((w) => w.id === wizard.id))
          unique_wizards.push(wizard);
      });
      res.json(unique_wizards);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/wizards/:id", (req, res) => {
  // #swagger.tags = ['Wizards']
  // #swagger.summary  = 'Get a wizard by id'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("SELECT * FROM wizard WHERE id=$1", [id])
    .then((result) => {
      const wizard = result.rows[0];
      delete wizard.password;
      res.json(wizard);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/wizards", (req, res) => {
  // #swagger.tags = ['Wizards']
  // #swagger.summary  = 'Create a wizard'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const wizard = req.body;
  client
    .query(
      "INSERT INTO wizard (email, password, lastname, firstname, birthdate, image, house_id, class_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        wizard.email,
        wizard.password,
        wizard.lastname,
        wizard.firstname,
        wizard.birthdate,
        wizard.image,
        wizard.house_id,
        wizard.class_id,
      ]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/wizards/:id", (req, res) => {
  // #swagger.tags = ['Wizards']
  // #swagger.summary  = 'Update a wizard'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const wizard = req.body;
  client
    .query(
      "UPDATE wizard SET lastname=$1, firstname=$2, birthdate=$3, image=$4, house_id=$5, class_id=$6, email=$7 WHERE id=$8 RETURNING *",
      [
        wizard.lastname,
        wizard.firstname,
        wizard.birthdate,
        wizard.image,
        wizard.house_id,
        wizard.class_id,
        wizard.email,
        id,
      ]
    )
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.delete("/wizards/:id", (req, res) => {
  // #swagger.tags = ['Wizards']
  // #swagger.summary  = 'Delete a wizard'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("DELETE FROM wizard WHERE id=$1", [id])
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/* Roles */
app.get("/roles", (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary  = 'Get all roles'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  client
    .query("SELECT * FROM role ORDER BY name ASC")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/roles/:id", (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary  = 'Get a role by id'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("SELECT * FROM role WHERE id=$1", [id])
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/roles", (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary  = 'Create a role'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const role = req.body;
  client
    .query("INSERT INTO role (name, is_staff) VALUES ($1, $2) RETURNING *", [
      role.name,
      role.is_staff,
    ])
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/roles/:id", (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary  = 'Update a role'
  // #swagger.description = ''
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const role = req.body;
  client
    .query("UPDATE role SET name=$1, is_staff=$2 WHERE id=$3 RETURNING *", [
      role.name,
      role.is_staff,
      id,
    ])
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/* Subject */
app.post("/subjects", (req, res) => {
  // #swagger.tags = ['Subject']
  // #swagger.summary  = 'Create a subject'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const subject = req.body;
  client
    .query(
      "INSERT INTO subject (name, description, image, room_id, wizard_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        subject.name,
        subject.description,
        subject.image,
        subject.room_id,
        subject.wizard_id,
      ]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/subjects/:id", (req, res) => {
  // #swagger.tags = ['Subject']
  // #swagger.summary  = 'Update a subject'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const subject = req.body;
  client
    .query(
      "UPDATE subject SET name=$1, description=$2, image=$3, room_id=$4, wizard_id=$5 WHERE id=$6 RETURNING *",
      [
        subject.name,
        subject.description,
        subject.image,
        subject.room_id,
        subject.wizard_id,
        id,
      ]
    )
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.delete("/subjects/:id", (req, res) => {
  // #swagger.tags = ['Subject']
  // #swagger.summary  = 'Delete a subject'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("DELETE FROM subject WHERE id=$1", [id])
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/* Classes */
app.get("/classes", (req, res) => {
  // #swagger.tags = ['Classes']
  // #swagger.summary  = 'Get all classes'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  client
    .query("SELECT * FROM class ORDER BY name ASC")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/classes/:id", (req, res) => {
  // #swagger.tags = ['Classes']
  // #swagger.summary  = 'Get a class by id'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("SELECT * FROM class WHERE id=$1", [id])
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/classes", (req, res) => {
  // #swagger.tags = ['Classes']
  // #swagger.summary  = 'Create a class'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const classe = req.body;
  client
    .query(
      "INSERT INTO class (name, level, image) VALUES ($1, $2, $3) RETURNING *",
      [classe.name, classe.level, classe.image]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/classes/:id", (req, res) => {
  // #swagger.tags = ['Classes']
  // #swagger.summary  = 'Update a class'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const classe = req.body;
  client
    .query(
      "UPDATE class SET name=$1, level=$2, image=$3 WHERE id=$4 RETURNING *",
      [classe.name, classe.level, classe.image, id]
    )
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.delete("/classes/:id", (req, res) => {
  // #swagger.tags = ['Classes']
  // #swagger.summary  = 'Delete a class'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("DELETE FROM class WHERE id=$1", [id])
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/* Houses */
app.get("/houses", (req, res) => {
  // #swagger.tags = ['Houses']
  // #swagger.summary  = 'Get all houses'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  client
    .query("SELECT * FROM house ORDER BY name ASC")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/houses/:id", (req, res) => {
  // #swagger.tags = ['Houses']
  // #swagger.summary  = 'Get a house by id'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("SELECT * FROM house WHERE id=$1", [id])
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/houses", (req, res) => {
  // #swagger.tags = ['Houses']
  // #swagger.summary  = 'Create a house'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const house = req.body;
  client
    .query(
      "INSERT INTO house (name, building, floor, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [house.name, house.building, house.floor, house.image]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/houses/:id", (req, res) => {
  // #swagger.tags = ['Houses']
  // #swagger.summary  = 'Update a house'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const house = req.body;
  client
    .query(
      "UPDATE house SET name=$1, building=$2, floor=$3, image=$4 WHERE id=$5 RETURNING *",
      [house.name, house.building, house.floor, house.image, id]
    )
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.delete("/houses/:id", (req, res) => {
  // #swagger.tags = ['Houses']
  // #swagger.summary  = 'Delete a house'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("DELETE FROM house WHERE id=$1", [id])
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/* Rooms */
app.get("/rooms", (req, res) => {
  // #swagger.tags = ['Rooms']
  // #swagger.summary  = 'Get all rooms'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  client
    .query("SELECT * FROM room ORDER BY name ASC")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.get("/rooms/:id", (req, res) => {
  // #swagger.tags = ['Rooms']
  // #swagger.summary  = 'Get a room by id'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("SELECT * FROM room WHERE id=$1", [id])
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.post("/rooms", (req, res) => {
  // #swagger.tags = ['Rooms']
  // #swagger.summary  = 'Create a room'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const room = req.body;
  client
    .query(
      "INSERT INTO room (name, building, floor, number, capacity, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        room.name,
        room.building,
        room.floor,
        room.number,
        room.capacity,
        room.image,
      ]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.put("/rooms/:id", (req, res) => {
  // #swagger.tags = ['Rooms']
  // #swagger.summary  = 'Update a room'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  const room = req.body;
  client
    .query(
      "UPDATE room SET name=$1, building=$2, floor=$3, number=$4, capacity=$5, image=$6 WHERE id=$7 RETURNING *",
      [
        room.name,
        room.building,
        room.floor,
        room.number,
        room.capacity,
        room.image,
        id,
      ]
    )
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

app.delete("/rooms/:id", (req, res) => {
  // #swagger.tags = ['Rooms']
  // #swagger.summary  = 'Delete a room'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  const id = req.params.id;
  client
    .query("DELETE FROM room WHERE id=$1", [id])
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

/*Swagger documentation*/
app.use(
  "/swagger-output.json",
  express.static(path.join(__dirname, "swagger-output.json"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`🟢 Backend (${port})`);
});
