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
      
      
      const sellTo = tarkovItems[0].name
      console.log(sellTo);
    })
    .catch(error => console.log(error));
};

// Use the tarkovItems variable outside of the function
