import { createLocalPlannerRepository } from './localRepository';
import type { PlannerRepository } from './repository';

let plannerRepository: PlannerRepository = createLocalPlannerRepository();

export function getPlannerRepository() {
  return plannerRepository;
}

export function setPlannerRepository(repository: PlannerRepository) {
  plannerRepository = repository;
}
