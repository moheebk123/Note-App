import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface NoteType {
  title: string,
  description: string | "" | undefined
}

class NoteService {
  async addNote(noteData: NoteType) {
    const res = await axios.post(`${API_URL}/note/add`, noteData);
    return res.data;
  }
  async updateNote(noteId: string) {
    const res = await axios.post(`${API_URL}/note/edit/${noteId}`);
    return res.data;
  }
  async deleteNote(noteId: string) {
    const res = await axios.delete(`${API_URL}/note/delete/${noteId}`);
    return res.data;
  }
  async getNotes() {
    const res = await axios.get(`${API_URL}/note/load`);
    return res.data;
  }
}

const noteService = new NoteService();
export default noteService;
