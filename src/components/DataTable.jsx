import React from "react";
import "./DataTable.css";

const DataTable = ({ data }) => {

    const groupData = (data) => {

        // Группировка по клиентам
        const groupedByClient = data.reduce((acc, item) => {
            const client = item.client || "Без клиента";

            if (!acc[client]) {
                acc[client] = [];
            }

            acc[client].push(item);
            return acc;

        }, {});

        // Сортировка клиентов по алфавиту
        const sortedClients = Object.keys(groupedByClient).sort();
        const result = [];

        sortedClients.forEach((client) => {
            const clientItems = groupedByClient[client];

            // Преобразуем volume в число для подсчета
            const totalVolumeClient = clientItems.reduce((sum, item) => {
                const volume = item.volume;
                if (volume === null || volume === undefined || volume === "") {
                    return sum;
                }
                const volumeNum = parseFloat(volume);
                return sum + (isNaN(volumeNum) ? 0 : volumeNum);
            }, 0);

            result.push({
                type: "client",
                name: client,
                totalVolumeClient: totalVolumeClient
            });

            // Группировка по адресам
            const groupedByAddress = clientItems.reduce((acc, item) => {
                const address = item.address || "Без адреса";

                if (!acc[address]) {
                    acc[address] = [];
                }

                acc[address].push(item);
                return acc;
            }, {});

            const sortedAddresses = Object.keys(groupedByAddress).sort();

            sortedAddresses.forEach((address) => {
                const addressItems = groupedByAddress[address];

                const totalVolumeAddress = addressItems.reduce((sum, item) => {
                    const volume = item.volume;
                    if (volume === null || volume === undefined || volume === "") {
                        return sum;
                    }
                    const volumeNum = parseFloat(volume);
                    return sum + (isNaN(volumeNum) ? 0 : volumeNum);
                }, 0);

                result.push({
                    type: "address",
                    name: address,
                    totalVolumeAddress: totalVolumeAddress
                });

                // Группировка по продуктам
                const groupedByProduct = addressItems.reduce((acc, item) => {
                    const product = item.product || "Без продукции";

                    if (!acc[product]) {
                        acc[product] = [];
                    }
                    
                    acc[product].push(item);
                    return acc;
                }, {});

                const sortedProducts = Object.keys(groupedByProduct).sort();

                
                sortedProducts.forEach((product) => {
                    const productItems = groupedByProduct[product];

                    const totalVolumeProduct = productItems.reduce((sum, item) => {
                        const volume = item.volume;
                        if (volume === null || volume === undefined || volume === "") {
                            return sum;
                        }
                        const volumeNum = parseFloat(volume);
                        return sum + (isNaN(volumeNum) ? 0 : volumeNum);
                    }, 0);

                    result.push({
                        type: "product",
                        name: product,
                        totalVolume: totalVolumeProduct
                    });

                    productItems.forEach((item) => {
                        result.push({ type: "item", data: item });
                    });
                });
            });
        });

        return result;
    };

    const flattenedData = groupData(data);

    // Приводим дату к формату ХХ.ХХ.ХХХХ
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Проверяем, что данные по сумме объёмов - числа
    const safeToFixed = (value) => {
        if (value === null || value === undefined) {
            return "-";
        }
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (typeof num !== 'number' || isNaN(num)) {
            return "-";
        }
        return num.toFixed(2);
    };

    const renderRow = (row, index) => {
        switch (row.type) {
            case "client":
                return (
                <tr key={`client-${index}`} className="group-row client-row">
                    <td className="group-title" colSpan="4">{row.name}</td>
                    <td className="total-volume">{safeToFixed(row.totalVolumeClient)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                );

            case "address":
                return (
                <tr key={`address-${index}`} className="group-row address-row">
                    <td></td>
                    <td className="group-title" colSpan="3">{row.name}</td>
                    <td className="total-volume">{safeToFixed(row.totalVolumeAddress)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                );

            case "product":
                return (
                <tr key={`product-${index}`} className="group-row product-row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="group-title">{row.name}</td>
                    <td className="total-volume">{safeToFixed(row.totalVolume)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                );

            case "item":
                const item = row.data;
                return (
                <tr
                    key={item.id}
                    className="detail-row"
                    onClick={() => (window.location.href = item.url)}
                    style={{ cursor: "pointer" }}
                >
                    <td className="product-row">{formatDate(item.date_waybill_issue)}</td>
                    <td className="product-row">{item.id}</td>
                    <td className="product-row">{item.plant_name || "-"}</td>
                    <td className="text-align-left">{item.product || "-"}</td>
                    <td>{safeToFixed(item.volume)}</td>
                    <td>-</td>
                    <td className="text-align-left">{item.carrier || "-"}</td>
                    <td className="text-align-left">{item.license_plate || "-"}</td>
                    <td className="text-align-left">{item.driver_name || "-"}</td>
                </tr>
                );

            default:
                return null;
        }
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Дата<br />ТТН</th>
                        <th>Номер<br />ТТН</th>
                        <th>П.<br />отгр</th>
                        <th>Заказчик/Объект/<br />Наименование продукции</th>
                        <th>Объём<br />м<sup>3</sup></th>
                        <th>Сумма<br />перевозки</th>
                        <th>Перевозчик</th>
                        <th>№ АБС<br />авто-<br />мобиля</th>
                        <th>Водитель,<br />ФИО</th>
                    </tr>
                    </thead>
                <tbody>
                    {flattenedData.map((row, index) => renderRow(row, index))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
