const selectAuthors = document.getElementById('selectAuthor');
const listAuthorsBooks = document.getElementById("ul-books")

selectAuthors.addEventListener("change", async (e) => {
  const authorId = e.target.value
  const authorBooks = await getAuthorBooks(authorId)
  listAuthorsBooks.innerHTML = ""
  authorBooks.forEach(book => {

    const list = document.createElement("li")
    const bookName = book.name
    list.innerText = bookName
    listAuthorsBooks.append(list)
  })



})

function getAuthorBooks(authorId) {
  return queryFetch(`
  query getBooks($id: String){
    author(id: $id){
      books{
        name
      }
    }
  }  
`, { id: authorId })
    .then(data => {
      return data.data.author.books
    })
}


function queryFetch(query, variables) {
  return fetch("http://localhost:8888/query", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables
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
      option.innerText = author.name
      selectAuthors.append(option)
    })

  })


