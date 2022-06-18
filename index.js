const { Client } = require("pg");
const args = process.argv.slice(2);
const typeFuncion = args[0];

// Realizar la conexión con PostgreSQL con la clase Client.
// para realizar la conexion con la base de datos las misma debe ser creada previamente,
// al igual que la tabla en este caso (student)
// y luego en la config agregar tu usuario y tu password.
const config = {
  user: "",
  host: "localhost",
  database: "class",
  password: "",
  port: 5432,
};

let client;
// Crear una función asíncrona para registrar un nuevo estudiante en la base de datos.
// todo el ejemplo para una agregar un nuevo estudiante es: (node index.js newStudent name rut grade level)
const newStudent = async (name, rut, grade, level) => {
  client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(
      `INSERT INTO student (name, rut, grade, level) VALUES ('${name}', '${rut}', '${grade}', '${level}') RETURNING *`
    );
    await client.end();
    return console.log(`new student '${name}' successfully added`);
  } catch (e) {
    await client.end();
    return `Error al crear estudiante. codigo: ${e.code}`;
  }
};
// Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut.
// todo el ejemplo para mostar a un estudiante especifico es: (node index.js getStudent rut)
const getStudent = async (rut) => {
  client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(
      `SELECT name, rut, grade, level FROM student WHERE rut = '${rut}'`
    );
    await client.end();
    return console.log("registro actual: ", res.rows);
  } catch (e) {
    await client.end();
    console.log(`no existe el estudiante rut ${rut}`);
  }
};
// Crear una función asíncrona para obtener por consola todos los estudiantes registrados.
// todo el ejemplo para mostrar a todos los estudiantes por consola es: (node index.js allStudents)
const allStudents = async () => {
  client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(
      "SELECT rut, name, grade, level FROM student"
    );
    await client.end();
    return console.log("Todos los estudiantes: ", res.rows);
  } catch (e) {
    await client.end();
    console.log("no hay registros en la tabla");
  }
};
//   Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos.
// todo el ejemplo para una actualizar a un estudiante es: (node index.js name, rut, grade, level)
const update = async (name, rut, grade, level) => {
  client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(
      `UPDATE student SET name = '${name}', level = '${level}', grade = '${grade}' WHERE rut = '${rut}' RETURNING *`
    );
    await client.end();
    return console.log(`estudiante '${name}' actualizado con exito`);
  } catch {
    await client.end();
    console.log(`no se logro actualizar al estudiante '${rut}'`);
  }
};

// Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos.
// todo : el ejemplo para una eliminar a un estudiante es: (node index.js destroy rut)
const destroy = async (rut) => {
  client = new Client(config);
  await client.connect();
  try {
    const res = await client.query(`DELETE FROM student WHERE rut = '${rut}'`);
    await client.end();
    return console.log(`estudiante con rut '${rut}' eliminado`);
  } catch {
    await client.end();
    console.log(`no se logro eliminar al estudiante '${rut}'`);
  }
};

if (typeFuncion == "newStudent") {
  newStudent(args[1], args[2], args[3], args[4]);
} else if (typeFuncion == "getStudent") {
  getStudent(args[1]);
} else if (typeFuncion == "allStudents") {
  allStudents();
} else if (typeFuncion == "update") {
  update(args[1], args[2], args[3], args[4]);
} else if (typeFuncion == "destroy") {
  destroy(args[1]);
}
