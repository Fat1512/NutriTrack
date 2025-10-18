import FormSettingRoutineRow from "./FormSettingRoutineRow";

export interface Meal {
  name: string;
  calories: number;
  image: string;
}

export type MealKey = "breakfast" | "lunch" | "dinner";

const sampleMeals: Record<MealKey, Meal[]> = {
  breakfast: [
    {
      name: "Spinach Feta Omelette",
      calories: 320,
      image: "https://via.placeholder.com/50",
    },
  ],
  lunch: [
    {
      name: "Grilled Veggie And Hummus Wrap",
      calories: 500,
      image: "https://via.placeholder.com/50",
    },
    {
      name: "Instant Coffee Stick",
      calories: 70,
      image: "https://via.placeholder.com/50",
    },
  ],
  dinner: [],
};

const MEALS: { key: MealKey; label: string; icon: string }[] = [
  { key: "breakfast", label: "Breakfast", icon: "☕" },
  { key: "lunch", label: "Lunch", icon: "🥗" },
  { key: "dinner", label: "Dinner", icon: "🌙" },
];

const FormSettingRoutine = () => {
  return (
    <div className="px-4 space-y-4">
      {MEALS.map((meal) => (
        <FormSettingRoutineRow
          key={meal.key}
          meals={sampleMeals[meal.key]}
          icon={meal.icon}
          label={meal.label}
        />
      ))}
    </div>
  );
};

export default FormSettingRoutine;
