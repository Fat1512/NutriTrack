/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useGoalContext, type Goal } from "../context/GoalContext";
import MiniSpinner from "./MiniSpinner";
import useUpdateGoalUser from "../feature/routine/useUpdateGoalUser";
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  border: "transparent",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  overflow: "hidden",
  padding: "10px 20px",
  color: "black",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function MyModal({ open, onClose }: ModalProps) {
  const { isLoading, goal } = useGoalContext();
  const { isPending, updateUserGoal } = useUpdateGoalUser();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Goal>({
    defaultValues: goal,
  });
  if (isLoading) return <MiniSpinner />;
  function handleOnClose() {
    reset();
    onClose();
  }
  function onSubmit(data: Goal) {
    updateUserGoal(data, {
      onSuccess: () => toast.success("Successfully update goal nutrient"),
      onError: (err) => toast.error(err.message),
    });
  }
  return (
    <Modal open={open} onClose={handleOnClose}>
      <Box sx={style}>
        <p
          onClick={handleOnClose}
          className="absolute right-3 cursor-pointer text-xl"
        >
          <span>
            <IoCloseCircleOutline size={30} />
          </span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center">
            <p className="font-bold text-2xl">Edit Goals Nutrient</p>
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Calories</p>
            <input
              type="text"
              id="goalCal"
              {...register("goalCal", {
                required: "Please fill in this field",
                valueAsNumber: true,
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                e.currentTarget.value += onlyNumbers;
              }}
              placeholder="Enter value"
              className="border border-gray-400 rounded px-2 py-2 w-full"
            />
            {errors.goalCal && (
              <ErrorMessage message={errors.goalCal.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Daily Calories</p>
            <input
              type="text"
              id="dailyGoalCal"
              {...register("dailyGoalCal", {
                required: "Please fill in this field",
                valueAsNumber: true,
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                e.currentTarget.value += onlyNumbers;
              }}
              placeholder="Enter value"
              className="border border-gray-400 rounded px-2 py-2 w-full"
            />
            {errors.dailyGoalCal && (
              <ErrorMessage message={errors.dailyGoalCal.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Protein</p>
            <input
              type="text"
              id="goalProtein"
              {...register("goalProtein", {
                required: "Please fill in this field",
                valueAsNumber: true,
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                e.currentTarget.value += onlyNumbers;
              }}
              placeholder="Enter value"
              className="border border-gray-400 rounded px-2 py-2 w-full"
            />
            {errors.goalProtein && (
              <ErrorMessage message={errors.goalProtein.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Fat</p>
            <input
              type="text"
              id="goalFat"
              {...register("goalFat", {
                required: "Please fill in this field",
                valueAsNumber: true,
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                e.currentTarget.value += onlyNumbers;
              }}
              placeholder="Enter value"
              className="border border-gray-400 rounded px-2 py-2 w-full"
            />
            {errors.goalFat && (
              <ErrorMessage message={errors.goalFat.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Carb</p>
            <input
              type="text"
              id="goalCarb"
              {...register("goalCarb", {
                required: "Please fill in this field",
                valueAsNumber: true,
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                e.currentTarget.value += onlyNumbers;
              }}
              placeholder="Enter value"
              className="border border-gray-400 rounded px-2 py-2 w-full"
            />
            {errors.goalCarb && (
              <ErrorMessage message={errors.goalCarb.message} />
            )}
          </div>

          <div className="flex p-2 justify-center space-x-5">
            <Button variant="primary" className="w-full">
              {isPending ? <MiniSpinner /> : "Save"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default MyModal;
