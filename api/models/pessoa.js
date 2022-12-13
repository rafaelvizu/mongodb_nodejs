import mongodb from "../db.js";

const pessoaSchema = new mongodb.Schema({
     nome: String
});
const Pessoa = mongodb.model('Pessoa', pessoaSchema);

export default Pessoa;