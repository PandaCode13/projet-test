const Home = () => {
  // TODO: Fetch and display consumption timeline data
  const items = Array.from({ length: 5 });

  return (
    <>
      <h1 className="md:text-2xl text-xl font-medium">Recent Consumptions Activity </h1>
      <ul className="m-4 space-y-4">
        {items.map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-4 px-4 py-4 border-2 border-green-800 rounded-xl"
          >
            <img
              className="h-20 w-20 rounded-full object-cover object-center ring-2 ring-emerald-900 shadow-sm"
              src="https://images.openfoodfacts.org/images/products/900/249/021/5408/front_sv.19.full.jpg"
              alt="Redbull 250ml"
            />
            <div className="flex flex-col">
              <p>
                <span className="font-semibold">John Doe</span> added Redbull
                250ml
              </p>
              <span>at 3PM - Kitchen</span>
            </div>
          </li>
        ))}
      </ul>
      {/* Add pagination */}
    </>
  );
};

export default Home;
