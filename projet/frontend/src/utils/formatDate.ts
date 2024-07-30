
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0 en JavaScript
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const formatDateInput = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1); // Les mois commencent à 0 en JavaScript
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}
