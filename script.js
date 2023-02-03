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

        const profitability = tarkovItems.map( (item) => {
          const sellTo = item.sellFor?.filter((sell) => sell.source !== "fleaMarket");
          if ( !item || !sellTo || !item.lastLowPrice || !item.sellFor) {
              return  {
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
          const profit = item.lastLowPrice ? biggestTraderSellValue - item.lastLowPrice: 0;
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

      const sortedItems = profitability.sort(function(a, b) {
        return parseFloat(b.fleaToTraderProfit) - parseFloat(a.fleaToTraderProfit);
      });

let count = 0;

      for (let i = 0; i < 10; i++) {
        html += `
        <tr>
          <td>${sortedItems[count].fleaToTraderProfit}</td>
          <td>${sortedItems[count].sellingSource}</td>
          <td>${sortedItems[count].fleaPrice}</td>
          <td>${sortedItems[count].traderSellPrice}</td>
          <td>${sortedItems[count].name}</td>
          <td><img src="${sortedItems[count].imageUrl}" alt="${sortedItems[count].name}" width="100" height="100" /></td>
        </tr>
      `
            
        count++   


      } 

      

output.innerHTML = html;
    })
    .catch(error => console.log(error));

};