module.exports = {
    concatManyWhere: (forMapString, column) => {
      let where = "";
      forMapString.split(" ").map((eachSection) => {
        where += `${column}='${eachSection}' AND `;
      });
      return where;
    },
    concatOneWhere: (value, column) => {
      return `${column}='${value}' AND`;
    },
    removeString: (url, stringFindReplace) => {
      if (url.includes(stringFindReplace)) {
        return url.replace(stringFindReplace, "");
      }
      return url;
    },
    generateOTP: (l) => {
      let s = "";
      const randomchar = function () {
        const n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //1-10
        if (n < 36) return String.fromCharCode(n + 55); //A-Z
        return String.fromCharCode(n + 61); //a-z
      };
      while (s.length < l) s += randomchar();
      return s;
    },
  };
  