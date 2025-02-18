import axios from "../axiosConfig";

interface CategoriesType {
	id: number;
	name: string;
}

export default async function getCategories() {
	const response = await axios.get<CategoriesType[]>(`/category`);
	return response.data;
}
