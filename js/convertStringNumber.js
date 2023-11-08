export const convertStringNumber = (n) => {
   const noSpaceStr = n.replace(/\s+/g, '');
   const num = parseFloat(noSpaceStr);

   if (!isNaN(num) && isFinite(num)) {
      return num;
   } else {
      return false;
   };
};