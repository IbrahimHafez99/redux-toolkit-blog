import AddPostForm from "./features/posts/AddPostForm";
import PostList from "./features/posts/PostList";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import { Routes, Route } from 'react-router-dom'
import EditPostForm from "./features/posts/EditPostForm";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;