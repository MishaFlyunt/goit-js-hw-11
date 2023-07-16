import { refs } from './refs';

export function showLoader() {
  refs.loaderElement.style.display = 'block';
}

export function hideLoader() {
  refs.loaderElement.style.display = 'none';
}
