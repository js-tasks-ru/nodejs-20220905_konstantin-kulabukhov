const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Инициализация валидатора', () => {
    it('значение min не должно быть больше значения max', () => {
      const validatorFn = () => {
        new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 4,
          },
        });
      };

      expect(validatorFn)
          .to.throw('Field: name; Error: Минимальное значение не должно быть больше максимального');
    });

    it('инициализация с неподдерживаемым типом данных у поля', () => {
      const validatorFn = () => {
        new Validator({
          isOpen: {
            type: 'boolean',
            min: 0,
            max: 1,
          },
        });
      };

      expect(validatorFn)
          .to.throw('Field: isOpen; Error: Тип данных boolean не поддерживается');
    });

    it('в строковых полях числа должны быть целыми', () => {
      const stringValidatorFn = () => {
        new Validator({
          name: {
            type: 'string',
            min: 1,
            max: 2.9,
          },
        });
      };

      const numberValidatorFn = () => {
        new Validator({
          name: {
            type: 'number',
            min: 1,
            max: 2.9,
          },
        });
      };

      expect(stringValidatorFn)
          .to.throw('Field: name; Error: Поле max должно быть целым числом');

      expect(numberValidatorFn)
          .to.not.throw();
    });

    it('в строковых полях числа должны быть положительными', () => {
      const stringValidatorFn = () => {
        new Validator({
          name: {
            type: 'string',
            min: -13,
            max: 15,
          },
        });
      };
      const numberValidatorFn = () => {
        new Validator({
          name: {
            type: 'number',
            min: -13,
            max: 15,
          },
        });
      };

      expect(stringValidatorFn)
          .to.throw('Field: name; Error: Поле min должно быть положительным числом');

      expect(numberValidatorFn)
          .to.not.throw();
    });

    it('инициализация без правил выбрасывает ошибку', () => {
      const validatorFn = () => {
        new Validator();
      };

      expect(validatorFn).to.throw('Error: Отсутствуют правила для вылидации');
    });
  }),

  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет корректные значения', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalalalalalala', age: 15});

      expect(errors).to.have.length(0);
    });

    it('валидатор пропускает несуществующее значение', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalalalalala', secondName: 'Lalalalalalala'});

      expect(errors).to.have.length(0);
    });
  });
});
