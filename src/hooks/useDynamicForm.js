import { useState } from "react";

export default function useDynamicForm(initialState = {}) {
	const [fields, setFields] = useState(initialState);

	const handleInputChange = (e) => {
		e.preventDefault();

		const type = e.target.type;
		const id = e.target.id;
		const value = e.target.value;
		const checked = e.target.checked;
		let checkboxValue = "";

		if (checked) {
			checkboxValue = `${fields[id]},${value}`;
		} else if (!checked && type === "checkbox") {
			const list = fields[`${id}`].split(",") || [];

			const filteredList = list.filter((item) => {
				return item !== value;
			});

			checkboxValue = filteredList.join();
		}

		const result =
			type === "number"
				? Number(value.replace(",", "."))
				: type === "checkbox"
				? checkboxValue
				: value;

		setFields({ ...fields, [`${id}`]: result });
	};

	return {
		fields,
		setFields,
		handleInputChange,
	};
}
