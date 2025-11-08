import { Ingrediente } from "./ingrediente.model";

export interface RecetaIngredientes {
    id:number;
    ingrediente: Ingrediente;
    cantidad: number;
}