import { Response } from 'express';
import { ValidationError } from 'class-validator';

export function getRequestErrors(res: Response, errors: ValidationError[]) {
  if (errors.length > 0) {
    return res.status(400).json(
      errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      })
    );
  }
}
