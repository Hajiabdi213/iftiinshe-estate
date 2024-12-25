import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* lefside */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen ">
        <form className="flex flex-col gap-8">
          {/* search term field */}
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search ..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type: </label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="scale-125" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="scale-125" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="scale-125" />
              <span> Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="scale-125" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities: </label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="scale-125" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="scale-125" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="">
            <label>Sort: </label>
            <select id="sort_order" className="border rounded-lg p-3 ">
              <option value="">Price high to low</option>
              <option value="">Price low to hight</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/* right side */}
      <div className="">
        <h1>Listing Results</h1>
      </div>
    </div>
  );
};

export default Search;
