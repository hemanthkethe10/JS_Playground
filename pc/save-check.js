module.exports = (input) => {
    /* Headers validation */
    if (!Array.isArray(input.headers)) {
      return {
        isSuccessful: false,
        message: "Headers must be provided as a list.",
        fieldPath: "headers"
      };
    }

    const seenHeaderKeys = new Set();

    for (let i = 0; i < input.headers.length; i++) {
      const header = input.headers[i];

      if (!header || typeof header !== "object") {
        return {
          isSuccessful: false,
          message: "Invalid header entry.",
          fieldPath: `headers[${i}]`
        };
      }

      const allowedHeaderKeys = ["businessUserGroupName", "businessUserGroupId"];
      const extraKeys = Object.keys(header).filter(
        k => !allowedHeaderKeys.includes(k)
      );

      if (extraKeys.length > 0) {
        return {
          isSuccessful: false,
          message: "Only key and value are allowed in headers.",
          fieldPath: `headers[${i}]`
        };
      }

      if (!header.businessUserGroupName || header.businessUserGroupName.trim() === "") {
        return {
          isSuccessful: false,
          message: "Header key must not be empty.",
          fieldPath: `headers[${i}].key`
        };
      }

      const normalizedKey = header.businessUserGroupName.trim().toLowerCase();
      if (seenHeaderKeys.has(normalizedKey)) {
        return {
          isSuccessful: false,
          message: "Header key names must be unique.",
          fieldPath: `headers[${i}].key`
        };
      }
      seenHeaderKeys.add(normalizedKey);

      if (!header.businessUserGroupId || header.businessUserGroupId.trim() === "") {
        return {
          isSuccessful: false,
          message: "Header value must not be empty.",
          fieldPath: `headers[${i}].value`
        };
      }
    }

    return {
      isSuccessful: true,
      message: "All fields are valid."
    };
}