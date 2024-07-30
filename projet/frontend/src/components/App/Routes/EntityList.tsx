import React, { useEffect } from 'react';
import EntityCard from '../../ui/EntityCard';
import fetchData from '../../../api/fetchData';
import './EntityList.scss'
type Endpoint = `/${string}`;
interface Entity {
    id: number;
    name?: string;
    image?: string;

}
interface EntityListProps<T extends Entity> {
    entrypoint: Endpoint;
    renderEntity: (entity: T) => React.ReactNode;
    renderFormEntity: (entity: T, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode;
}

function EntityList<T extends Entity>({ entrypoint, renderEntity, renderFormEntity }: EntityListProps<T>) {
    const [data, setData] = React.useState<T[]>([]);
    const [update, setUpdate] = React.useState(false);
    useEffect(() => {
        fetchData<T[]>(entrypoint, localStorage.getItem('token')).then((data) => {
            setData(data);
        });

    }, [entrypoint, update]);
    const handleUpdate = () => {
        setUpdate(!update);
    }

    return (
        <main className="entity_list">
            {data.map(entity => (
                <EntityCard key={entity.id} entity={entity} renderDetails={renderEntity} onUpdate={handleUpdate} renderForm={renderFormEntity} entrypoint={entrypoint} />
            ))}
        </main>
    );
}

export default EntityList;