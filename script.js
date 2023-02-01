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
  .then(data => 
    
    
    console.log('data returned:', data)
    
    )
  .catch()
  ;
};