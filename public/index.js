const selectAuthors = document.getElementById('selectAuthor');
const listBooks = document.getElementById("ul-books")

selectAuthors.addEventListener("change", async (e) => {
  const authorId = e.target.value
  const data = await getAuthorBooks(authorId)
  const authorBooks = data.data.author.books
  listBooks.innerHTML = ""
  authorBooks.forEach(book => {

    const list = document.createElement("li")
    const bookName = book.name
    list.innerText = bookName
    listBooks.append(list)
  })



})

function getAuthorBooks(id) {
  return queryFetch(`
  query{
    author(id: ${id}){
      books{
        name
      }
    }
  }  
`)
}


function queryFetch(query) {
  return fetch("http://localhost:8888/query", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      query: query
    })
  }).then(res => res.json())
}

fetch('http://localhost:8888/query', {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify({
    query: `
        query{
            authors{
              id
              name
            }
          }
            `
  })
})
  .then(res => res.json())
  .then(response => {
    response.data.authors.forEach(author => {
      const option = document.createElement("option");
      option.value = author.id
      option.name = author.name
      option.innerText = author.name
      selectAuthors.append(option)
    })

  })


