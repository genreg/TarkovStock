fetch('https://api.tarkov.dev/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: `{
    items(name: "m855a1") {
        id
        name
        shortName
    }
}`})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));