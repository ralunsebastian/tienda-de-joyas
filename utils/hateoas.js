const buildHATEOAS = ({ items, page, limit, total, baseUrl, query }) => {
  const totalPages = Math.ceil(total / limit);

  const makeLink = (pageNum) => {
    const q = new URLSearchParams({ ...query, page: pageNum, limits: limit }).toString();
    return `${baseUrl}?${q}`;
  };

  return {
    total,             // total general en BD
    page,
    limit,
    totalPages,
    joyas: items.map((j) => ({
      name: j.nombre,
      href: `/joyas/${j.id}`,
    })),
    links: {
      self: makeLink(page),
      prev: page > 1 ? makeLink(page - 1) : null,
      next: page < totalPages ? makeLink(page + 1) : null,
    }
  };
};

export default buildHATEOAS;
