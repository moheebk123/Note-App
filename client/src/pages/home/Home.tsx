import { useEffect, useState } from "react";
import { Button, Header, NoteInput, WelcomeBox } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { bin, edit, show } from "../../assets";
import { alertActions, userDataActions } from "../../store";
import { authService, noteService } from "../../utils";
import type { AxiosError } from "axios";

interface NoteType {
  _id?: string;
  title: string;
  description?: string;
  createdBy?: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  notes: Array<NoteType> | [];
}

interface StoreType {
  userData: UserType;
}

type ActionType = "add" | "edit" | "view";

interface DataType {
  action: ActionType;
  noteId?: string;
  showNoteInput: boolean;
  title?: string;
  description?: string;
}

const Home = () => {
  const [data, setData] = useState<DataType>({
    showNoteInput: false,
    action: "add",
    noteId: "",
    title: "",
    description: "",
  });

  const userData = useSelector((store: StoreType) => store.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeNoteInput = (
    newAction: ActionType,
    note: NoteType | undefined
  ) => {
    if ((note && newAction === "edit") || newAction === "view") {
      setData({
        title: note?.title,
        description: note?.description,
        action: newAction,
        noteId: note?._id,
        showNoteInput: true,
      });
    } else {
      setData({
        action: newAction,
        showNoteInput: true,
        title: "",
        description: "",
        noteId: "",
      });
    }
  };

  const handleShowHideNoteInput = () => {
    setData((prev) => ({ ...prev, showNoteInput: !prev.showNoteInput }));
  };

  const handleDeleteNote = async (noteId: string | undefined) => {
    if (noteId) {
      try {
        const response = await noteService.deleteNote(noteId);
        if (response.success) {
          dispatch(
            alertActions.showAlert({
              show: true,
              severity: "success",
              message: response.message,
            })
          );

          const authResponse = await authService.checkAuth();
          if (authResponse.success) {
            dispatch(userDataActions.updateUser(authResponse.user));
          }
        } else {
          dispatch(
            alertActions.showAlert({
              show: true,
              severity: "error",
              message: response.message,
            })
          );
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
          dispatch(
            alertActions.showAlert({
              show: true,
              severity: "error",
              message: err.response?.data.message,
            })
          );
      }
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
    }
  };

  return (
    <div>
      <Header />
      <WelcomeBox name={userData.name} email={userData.email} />
      {data.showNoteInput ? (
        <NoteInput
          action={data.action}
          noteId={data.noteId}
          title={data.title}
          description={data.description}
          handleHideNoteInput={handleShowHideNoteInput}
        />
      ) : (
        <Button
          text="Create Note"
          classes="my-8"
          type="button"
          onClick={() => handleChangeNoteInput("add", undefined)}
        />
      )}

      <h2 className="text-3xl font-semibold mb-5">Notes</h2>
      {userData.notes.length === 0 ? (
        <p>No note added yet.</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {userData.notes.map((note) => (
            <li
              key={note._id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg box-shadow"
            >
              <h4 className="text-xl grow font-semibold">{note.title}</h4>
              <div className="flex gap-2 items-center">
                <img
                  src={show}
                  alt="View Note"
                  title="View Note"
                  className="hover:bg-gray-100 rounded-full p-2 cursor-pointer h-10 w-10"
                  onClick={() => handleChangeNoteInput("view", note)}
                />
                <img
                  src={edit}
                  alt="Edit Note"
                  title="Edit Note"
                  className="hover:bg-gray-100 rounded-full p-2 cursor-pointer h-10 w-10"
                  onClick={() => handleChangeNoteInput("edit", note)}
                />
                <img
                  src={bin}
                  alt="Delete Note"
                  title="Delete Note"
                  className="hover:bg-gray-100 rounded-full p-2 cursor-pointer"
                  onClick={() => handleDeleteNote(note._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
