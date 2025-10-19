import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import type { GoalNutrient } from "../feature/routine/GoalNutrient";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
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

interface ModalProps<GoalNutrient> {
  open: boolean;
  onClose: () => void;
  properties?: GoalNutrient;
}

function MyModal({ open, onClose, properties }: ModalProps<GoalNutrient>) {
  const {
    handleSubmit,
    control,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<GoalNutrient>({
    defaultValues: properties,
  });

  function handleOnClose() {
    reset();
    onClose();
  }
  function onSubmit(data: GoalNutrient) {
    toast.success("Successfully update goal nutrient");
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
              id="calories"
              {...register("calories", {
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
            {errors.calories && (
              <ErrorMessage message={errors.calories.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Protein</p>
            <input
              type="text"
              id="protein"
              {...register("protein", {
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
            {errors.protein && (
              <ErrorMessage message={errors.protein.message} />
            )}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Fat</p>
            <input
              type="text"
              id="fat"
              {...register("fat", {
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
            {errors.fat && <ErrorMessage message={errors.fat.message} />}
          </div>
          <div className="flex flex-col p-2">
            <p className="font-medium">Carb</p>
            <input
              type="text"
              id="carb"
              {...register("carb", {
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
            {errors.carb && <ErrorMessage message={errors.carb.message} />}
          </div>

          <div className="flex p-2 justify-center space-x-5">
            <Button variant="primary" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default MyModal;
