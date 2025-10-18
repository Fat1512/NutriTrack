import type { FoodItemProps } from "./FoodItem";
import FoodItem from "./FoodItem";

const foods: FoodItemProps[] = [
  {
    name: "Cơm gà",
    calories: 350,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Phở bò",
    calories: 300,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Bún chả",
    calories: 400,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Trứng chiên",
    calories: 200,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Salad",
    calories: 150,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Sữa chua",
    calories: 100,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Bánh mì",
    calories: 250,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Salad",
    calories: 150,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Sữa chua",
    calories: 100,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
  {
    name: "Bánh mì",
    calories: 250,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },

  {
    name: "Bánh mì",
    calories: 250,
    image:
      "https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg",
  },
];

const FoodList = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {foods.map(({ name, image, calories }, idx) => (
        <FoodItem key={idx} name={name} image={image} calories={calories} />
      ))}
    </div>
  );
};

export default FoodList;
