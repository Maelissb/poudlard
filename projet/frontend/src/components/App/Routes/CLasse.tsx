import { useEffect, useState } from "react";

import ClasseCard from "../../ui/ClasseCard";

const Classe: React.FC = () => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/classes`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                })
            });
            const data = await response.json();
            console.log(data);

            setData(data);
        } catch (error) {
            console.error(error);
        }


    };
    useEffect(() => {

        fetchData();
    }, []);
    return (
        <>
            <main className="staff_list">
                {data && data.map((item) => <ClasseCard key={item.id} classe={item} />)}
            </main>

        </>
    );
};

export default Classe;