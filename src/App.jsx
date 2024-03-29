import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

const urlBaseServer = "http://localhost:3000";

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const { data: posts } = await axios.get(urlBaseServer + "/posts");
    setPosts([...posts]);
  };

  const agregarPost = async () => {
    // Verifica si todos los campos están llenos
    if (!titulo.trim() || !imgSrc.trim() || !descripcion.trim()) {
      // Si algún campo está vacío, muestra un mensaje de error y no continúa
      console.log("Por favor, completa todos los campos.");
      return;
    }
  
    // Si todos los campos están llenos, procede con la lógica de agregarPost
    const post = { titulo, img: imgSrc, descripcion };
    await axios.post(urlBaseServer + "/posts", post);
    getPosts();
  };

// este método se utilizará en el siguiente desafío
const like = async (id) => {
  try {
    await axios.put(urlBaseServer + `/posts/like/${id}`);
    // Actualiza el estado local directamente sin hacer una nueva solicitud
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  } catch (error) {
    console.error('Error al dar like:', error);
  }
};

  // este método se utilizará en el siguiente desafío
  const eliminarPost = async (id) => {
    await axios.delete(urlBaseServer + `/posts/${id}`);
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={i}
              post={post}
              like={like}
              eliminarPost={eliminarPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
