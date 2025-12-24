// Приводим дату к формату ХХ.ХХ.ХХХХ
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Проверяем, что данные по сумме объёмов - числа
export const safeToFixed = (value) => {
    if (value === null || value === undefined) {
        return "-";
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof num !== 'number' || isNaN(num)) {
        return "-";
    }
    return num.toFixed(2);
};