// Приводим дату к формату ХХ.ХХ.ХХХХ
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Функция группировки
export const groupBy = (array, fieldName, noName) => {
    return array.reduce((acc, item) => {
        const key = item[fieldName] || noName;

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(item);
        return acc;

    }, {});
};

// Функция для подсчёта объёма с проверкой на числа
export const totalVolume = (items) => {
    return items.reduce((sum, item) => {
        const volume = item.volume;
        if (volume === null || volume === "") {
            return sum;
        }
        const volumeNum = parseFloat(volume);
        return (sum + (isNaN(volumeNum) ? 0 : volumeNum));
    }, 0);
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