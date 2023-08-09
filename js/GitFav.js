export class GitHubUser {
    static search(username){
        const endPoint = `https://api.github.com/users/${username}`

        return fetch(endPoint)
        .then(data => data.json()) //Aqui tranformo o meu endpoint em JSON
        .then(({name, login, public_repos, followers}) => 
        ({name, login, public_repos, followers})) //Aqui pego os dados dentro do Github usando uma forma desestruturada
    }

} //passo 11 -> Criar a class que busca os dados na GitHUb


// Parte dd criação dados
export class Favorites {
    constructor(root){ //passo 5 -> o super é esse constructor, então o root daqui o root passado no super que pegue quando instancie no main.js ou o root é o #app

       this.root = document.querySelector(root)
       this.load() // passo 8-> cria os dados da aplicação

       this.tbody = this.root.querySelector("table tbody")

       


    }

    save(){
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
        
    }

    async add(username){
        

        try {

            const userExist = this.entries.find(entry => entry.login === username)


            if(userExist){
                throw new Error("Usuário já existe")
                return
            }


            const user = await GitHubUser.search(username) // tento pegar o usuario

            if(user.login === undefined){
                throw new Error("usuário não encontrado!") // se ele for indefinido jogo esse erro na tela
            }

             this.entries = [user, ...this.entries] // salvo o user dentro do this.entries e depois coloco os usuarios user já salvos na frente dele
             this.update()
             this.save()
             
        
        } catch (error) {
            alert(error.message) // aqui capturo o error e exculto a mensagem
        }

    } // passo 13 -> determino que esse function é async, quer dizer que ela espera para ser execultada e retorna uma promise


    load(){
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    }

    delete(user){

        const filteredentries = this.entries
        .filter(entry => entry.login !== user.login

            //retornar false elimina do array e se for true adiciona no array
        )

        this.entries = filteredentries
        this.update()
        this.save()

        console.log(filteredentries)
    }




}

//Parte de vizulalizaçao dos dados
export class FavoritesView extends Favorites {

    constructor(root){
        super(root)   // passo 4 -> recebi o do main.js o #app como root passei para o super

        
        this.update()
        this.onadd()

        
    }

    update(){


        this.removeAllTr() //passo 6 -> remove todas as tr da pagina usando forEach
        this.createRows() //passo 7 -> cria as tr
    
        this.entries.forEach(user => { //passo 9 -> para cada entries/user crio uma row/tr e modifico os dados dela de acordo com o que passei no load() na class Favorites
            const row = this.createRows();

            row.querySelector("td img").src = `https://github.com/${user.login}.png`
            row.querySelector("td img").alt = `Imagem de ${user.name}`
            row.querySelector("td a").href = `https://github.com/${user.login}`    
            row.querySelector("td a p").textContent = `${user.name}`
            row.querySelector("td a span").textContent = `${user.login}`
            row.querySelector("#repositories").textContent = `${user.public_repos}`
            row.querySelector("#followers").textContent = `${user.followers}`
            
            row.querySelector("#button").onclick = () => {

                const isOk = confirm("Tem certeza que deseja deletar essa linha")

                if(isOk){
                    this.delete(user)
                }
            } //Passo 11 aqui onde criamos o botao de remover // Aqui estou denterminando que onde eu cliquei é true

            this.tbody.append(row) //passo 10 -> append coloca dentro nesse caso do tbody um elemento html criado pela DOM, o elemento colocado aqui a Row modificada 
        })
    }

    onadd(){
        const searchButton = this.root.querySelector(".search-button")
        

        searchButton.onclick = () => {
            const { value } = this.root.querySelector(".input-search input")
            
            this.add(value)
        }
        } //passo 12 -> Pegamos o valor do input quando clicar no botão

    

    removeAllTr(){

        const tr = this.root.querySelectorAll('tbody tr').forEach( tr => {
            tr.remove() // ForEach -> para cada elemento execulta a função que passei pra dentro
            


        });
        
    }

    createRows(){
        const tr = document.createElement("tr")

        tr.innerHTML = `
            <td id="user">
            <img src="https://github.com/lucasvs01.png" alt="Imagem de lucas Vilaça">
            <a href="https://github.com/lucasvs01" target="_blank">
                <p>Lucas Vilaça</p>
                <span>/lucasvs01</span>
            </a>
            </td>

            <td id="repositories">
                168
            </td>

            <td id="followers">
                1234
            </td>

            <td id="button">
                <button>Remover</button>
            </td>
        `
        return tr
    }


}

