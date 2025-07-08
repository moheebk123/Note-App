import { useRef, type SyntheticEvent } from "react";
import Button from "../button/Button";
import { useDispatch } from "react-redux";
import { alertActions, userDataActions } from "../../../store";
import { authService, noteService } from "../../../utils";
import type { AxiosError } from "axios";

interface NoteType {
  title: string;
  description?: string;
}

const NoteInput = ({
  action,
  noteId,
  title,
  description,
  handleHideNoteInput,
}: {
  action: "add" | "edit" | "view";
  noteId?: string;
  title?: string;
  description?: string;
  handleHideNoteInput: () => void;
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const titleValue = String(titleRef.current?.value);
    const descriptionValue = descriptionRef.current?.value;
    const noteData = {
      title: titleValue,
      description: descriptionValue,
    };

    if (action === "add") {
      handleAddNote(noteData);
    } else if (action === "edit") {
      handleEditNote(noteData);
    }
    handleHideNoteInput();
  };

  const handleAddNote = async (noteData: NoteType) => {
    if (!noteData.title) {
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: "Note title is required.",
        })
      );
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
      return;
    }

    try {
      const response = await noteService.addNote(noteData);
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
  };

  const handleEditNote = async (noteData: NoteType) => {
    if (!noteData.title) {
      dispatch(
        alertActions.showAlert({
          show: true,
          severity: "error",
          message: "Note title is required.",
        })
      );
      setTimeout(() => {
        dispatch(alertActions.showAlert({}));
      }, 5000);
      return;
    }

    if (noteId) {
      try {
        const response = await noteService.updateNote(noteId, noteData);
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
    }
    setTimeout(() => {
      dispatch(alertActions.showAlert({}));
    }, 5000);
  };

  return (
    <form
      className="my-8 flex flex-col gap-5 w-full max-w-2xl px-3 py-5 border border-gray-200 rounded-lg shadow-lg"
      onSubmit={handleFormSubmit}
    >
      <h3 className="text-2xl font-semibold text-center">Note Details</h3>
      <input
        type="text"
        ref={titleRef}
        placeholder="Enter note title"
        defaultValue={title}
        disabled={action === "view" ? true : false}
        required
        className="border border-gray-200 shadow rounded-md text-xl p-3 outline-0"
      />
      <input
        type="text"
        ref={descriptionRef}
        placeholder="Enter note description"
        defaultValue={description}
        disabled={action === "view" ? true : false}
        className="border border-gray-200 shadow rounded-md text-xl p-3 outline-0"
      />
      <div className="flex gap-3">
        {action === "add" ? (
          <Button text="Add Note" type="submit" classes="grow" />
        ) : action === "edit" ? (
          <Button text="Edit Note" type="submit" classes="grow" />
        ) : (
          <></>
        )}
        <Button
          text="Close Note"
          type="button"
          onClick={handleHideNoteInput}
          classes="grow bg-red-500 hover:bg-red-600"
        />
      </div>
    </form>
  );
};

export default NoteInput;
