import { cpm } from './constants';

function CalculateHP(staminaStat, level = 30, staIV = 15) {
	var CP_Multiplier = cpm[2 * level - 2]; 
	var Stamina = staminaStat + staIV;

	return Stamina * CP_Multiplier;
}

export default {
    CalculateHP
}