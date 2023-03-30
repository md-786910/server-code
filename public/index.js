
const tableBox = document.querySelector(".tableBox")

document.addEventListener('DOMContentLoaded', async () => {
    const base_url = "http://localhost:5000"
    try {
        const resp = await fetch(`${base_url}/getProduct`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await resp.json()
        if (data.success) {

            let str = "";
            data.data.map((item, index) => {

                str += `<tr>
                <th scope="row">${index + 1}</th>
                <td>${item.productName}</td>
                <td>${item.description}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
               </tr>
              `

            })

            tableBox.innerHTML = str;

        } else {
            return;
        }
    } catch (error) {
        console.log(error);
    }
})



