module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;

    this.init();
  }

  init() {
    if (!this.rules) {
      throw new Error('Error: Отсутствуют правила для вылидации');
    }

    Object.entries(this.rules).forEach(([name, rule]) => {
      const requiredRules = ['type', 'min', 'max'];
      const allowedTypes = ['string', 'number'];
      const sizeRules = ['min', 'max'];

      if (!allowedTypes.includes(rule.type)) {
        throw new Error(
            `Field: ${name}; Error: Тип данных ${rule.type} не поддерживается`,
        );
      }

      requiredRules.forEach((requiredRule) => {
        if (requiredRule === undefined) {
          throw new Error(
              `Field: ${name}; Error: Отсутствует обязательное поле ${requiredRule}`,
          );
        }
      });

      if (rule.type === 'string') {
        sizeRules.forEach((sizeRule) => {
          const ruleValue = rule[sizeRule];

          if (!Number.isInteger(ruleValue)) {
            throw new Error(`Field: ${name}; Error: Поле ${sizeRule} должно быть целым числом`);
          }

          if (ruleValue < 0) {
            throw new Error(
                `Field: ${name}; Error: Поле ${sizeRule} должно быть положительным числом`,
            );
          }
        });
      }

      if (rule.min > rule.max) {
        throw new Error(
            `Field: ${name}; Error: Минимальное значение не должно быть больше максимального`,
        );
      }
    });
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
