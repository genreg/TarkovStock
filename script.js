let tarkovItems;

window.onload = function() {
  fetch('https://api.tarkov.dev/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `{
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
      console.log(tarkovItems);
      
      
      tarkovItems.forEach(item => {
        item.sellFor = item.sellFor.filter(sellForItem => sellForItem.source !== 'fleaMarket');
      });
      console.log(tarkovItems);

      tarkovItems.forEach(item => {

        let itemName = item.name;
        let highestPriceRUB = 0;
        let lowestPriceRUB = item.lastLowPrice;
        let averagePriceRUB = item.avg24hPrice;
        let picture =  item.image8xLink;
        let highestSource;

  for (let i = 0; i < item.sellFor.length; i++) {
    if (item.sellFor[i].priceRUB > highestPriceRUB) {
      highestPriceRUB = item.sellFor[i].priceRUB;
      highestSource = item.sellFor[i].source;
    }
  }
  if (highestPriceRUB) {
    console.log(itemName, lowestPriceRUB, averagePriceRUB, picture, highestPriceRUB, highestSource);
  }
      });

    })
    .catch(error => console.log(error));

};

