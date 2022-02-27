// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function(namespaceURI: string, qualifiedName: string) {
  if (namespaceURI==='http://www.w3.org/2000/svg' && qualifiedName==='svg'){
    const element: any = createElementNSOrig.apply(this, arguments as any);
    element.createSVGRect = function(){}; 
    return element;
  }
  return createElementNSOrig.apply(this,arguments as any)
}