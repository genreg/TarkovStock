let tarkovItems;
const output = document.getElementById("output");

//makes more rows when you click load more items
let row = 0;
let html = "";



window.onload = function () {

  //loads TARKOV API
  fetch('https://api.tarkov.dev/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      //loads items
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

      //shortening data
      tarkovItems = data.data.items;

      const profitability = tarkovItems.map((item) => {

        //removing fleamarket
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

        //filtering biggest trade value from traders
        const biggestTraderSellValue = Math.max(...sellTo.map(sell => Number(sell.priceRUB)))

        //profit calculation
        const profit = item.lastLowPrice ? biggestTraderSellValue - item.lastLowPrice : 0;

        //shortening and finding trader value
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

      //sorting highest to lowest
      const sortedItems = profitability.sort(function (a, b) {
        return parseFloat(b.fleaToTraderProfit) - parseFloat(a.fleaToTraderProfit);
      });

      let count = 0;

      //printing html
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
            <td>$${sortedItems[count].fleaToTraderProfit}</td>
            <td>${sortedItems[count].sellingSource}</td>
            <td>$${sortedItems[count].fleaPrice}</td>
            <td>$${sortedItems[count].traderSellPrice}</td>
            <td>$${sortedItems[count].name}</td>
            <td><img src="${sortedItems[count].imageUrl}" alt="${sortedItems[count].name}" height="50" /></td>
          </tr>
        `;

        count++;
      }

      html += `
      </table>`;

      const output = document.getElementById("output");
      output.innerHTML = html;

      //load more button
      const loadMoreButton = document.getElementById("load");

      //when you press load more
      loadMoreButton.addEventListener("click", function () {
        let newHtml = ``;


        for (let i = 0; i < 10; i++) {
          if (count === sortedItems.length) {
            break;
          }

          newHtml += `
            <tr>
              <td>$${sortedItems[count].fleaToTraderProfit}</td>
              <td>${sortedItems[count].sellingSource}</td>
              <td>$${sortedItems[count].fleaPrice}</td>
              <td>$${sortedItems[count].traderSellPrice}</td>
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

      //timer function
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

          //store the remaining time in a cookie
          document.cookie = "remaining_time=" + timer + ";max-age=" + (duration - timer);
        }, 1000);
      }


      var display = document.querySelector('#timer');

      //check if there is a remaining time stored in a cookie
      var remaining_time = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)remaining_time\s*\=\s*([^;]*).*$)|^.*$/, "$1"), 10) || 300;
      startTimer(remaining_time, display);

    })
    .catch(error => console.log(error));

};