// CommonJS-совместимая версия с chalk@4
import chalk from 'chalk';
import { generateCharacterValue } from '../src/utils/ValueGeneratorEngine';
import { ValueNameLabelMap } from '../src/types/valueName';

console.log(chalk.blue('\n🎲 Generated Character Values:\n'));

for (let i = 0; i < 5; i++) {
  const value = generateCharacterValue();

  console.log(`${chalk.green('💡 ' + ValueNameLabelMap[value.name])} (${value.name})`);
  console.log(`  Category:        ${value.category}`);
  console.log(`  Type:            ${value.type.join(', ')}`);
  console.log(`  Source:          ${value.source.join(', ')}`);
  console.log(`  Sphere:          ${value.sphere}`);
  console.log(`  Emotional tone:  ${value.emotionalTone}`);
  console.log(`  Stability:       ${value.stability}`);
  console.log(`  Measurable:      ${value.measurable ? '✔ yes' : '✘ no'}`);
  console.log(`  Value Score:     ${value.valueScore}`);
  console.log(chalk.gray('----------------------------------------\n'));
}
