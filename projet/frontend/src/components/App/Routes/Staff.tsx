import { useEffect, useState } from "react";
import { StaffMember } from "../../../@types/wizard";
import StaffCard from "../../ui/StaffCard";

import "./Staff.scss";





const Staff: React.FC = () => {
    const [data, setData] = useState<StaffMember[] | null>(null);


    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/staff`);
            const data = await response.json();

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

                {data && data.map((item) => <StaffCard key={item.wizard.id} {...item} onActionComplete={() => {

                    fetchData()
                }} />)}

            </main>

        </>
    );
};

export default Staff;