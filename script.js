let tarkovItems;
const output = document.getElementById("output");
let row = 0;
let html = "";



window.onload = function () {
  fetch('https://api.tarkov.dev/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `{
      items {
          id
          name
          shortName
          lastLowPrice
          avg24hPrice
          basePrice
          image8xLink
          sellFor {
              priceRUB
              price
              source
              currency
          }
      }
  }`})
  })
    .then(r => r.json())
    .then(data => {
      tarkovItems = data.data.items;

      const profitability = tarkovItems.map((item) => {
        const sellTo = item.sellFor?.filter((sell) => sell.source !== "fleaMarket");
        if (!item || !sellTo || !item.lastLowPrice || !item.sellFor) {
          return {
            name: item?.name,
            sellingSource: 'N/A',
            basePrice: '0',
            fleaPrice: '0',
            fleaToTraderProfit: '0',
            traderSellPrice: '0',
            imageUrl: ''
          }
        }
        const biggestTraderSellValue = Math.max(...sellTo.map(sell => Number(sell.priceRUB)))
        const profit = item.lastLowPrice ? biggestTraderSellValue - item.lastLowPrice : 0;
        const trader = item.sellFor.find((seller) => seller.priceRUB === biggestTraderSellValue);
        return {
          name: item.name,
          sellingSource: trader?.source,
          basePrice: String(item.basePrice),
          fleaPrice: String(item.lastLowPrice),
          fleaToTraderProfit: String(profit),
          traderSellPrice: String(biggestTraderSellValue),
          imageUrl: item.image8xLink
        }
      }).filter((item) => item.sellingSource !== 'N/A');

      const sortedItems = profitability.sort(function (a, b) {
        return parseFloat(b.fleaToTraderProfit) - parseFloat(a.fleaToTraderProfit);
      });

      let count = 0;

      let html = `
      <table class="item-table">
        <tr>
          <th>PROFIT</th>
          <th>SELL TO</th>
          <th>FLEA PRICE</th>
          <th>SELL PRICE</th>
          <th>NAME</th>
          <th>IMAGE</th>
        </tr>`;

      for (let i = 0; i < 10; i++) {
        if (count === sortedItems.length) {
          break;
        }

        html += `
          <tr>
            <td>${sortedItems[count].fleaToTraderProfit}</td>
            <td>${sortedItems[count].sellingSource}</td>
            <td>${sortedItems[count].fleaPrice}</td>
            <td>${sortedItems[count].traderSellPrice}</td>
            <td>${sortedItems[count].name}</td>
            <td><img src="${sortedItems[count].imageUrl}" alt="${sortedItems[count].name}" height="50" /></td>
          </tr>
        `;

        count++;
      }

      html += `
      </table>`;

      const output = document.getElementById("output");
      output.innerHTML = html;

      const loadMoreButton = document.getElementById("load");

      loadMoreButton.addEventListener("click", function () {
        let newHtml = ``;

        for (let i = 0; i < 10; i++) {
          if (count === sortedItems.length) {
            break;
          }

          newHtml += `
            <tr>
              <td>${sortedItems[count].fleaToTraderProfit}</td>
              <td>${sortedItems[count].sellingSource}</td>
              <td>${sortedItems[count].fleaPrice}</td>
              <td>${sortedItems[count].traderSellPrice}</td>
              <td>${sortedItems[count].name}</td>
              <td><img src="${sortedItems[count].imageUrl}" alt="${sortedItems[count].name}" height="50" /></td>
            </tr>
          `;

          count++;
        }

        output.querySelector(".item-table").insertAdjacentHTML("beforeend", newHtml);


        html += `</table>`
      });
      html += `</table>`


      function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            timer = duration;
          }
        }, 1000);
      }


      var fiveMinutes = 60 * 5,

        display = document.querySelector('#timer');


      output.innerHTML = html;

      startTimer(fiveMinutes, display);


    })
    .catch(error => console.log(error));

};