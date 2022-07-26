import AddPostForm from "./features/posts/AddPostForm";
import PostList from "./features/posts/PostList";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import { Routes, Route, Navigate } from 'react-router-dom'
import EditPostForm from "./features/posts/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
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
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
        <Route path="*" element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  );
}

export default App;