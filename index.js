import { inherits, ingest, Transform } from "vega";

/**
 * Generates a binning function for discretizing data.
 * @constructor
 * @param {object} params - The parameters for this operator.
 * @param {function(object): *} params.query - The SQL query.
 */
export default function Core(params) {
  Transform.call(this, [], params);
}

Core.session = function(session) {
  if (session) {
    this._session = session;
    return this;
  }

  return this._session;
};

Core.Definition = {
  type: "MapD",
  metadata: { changes: true, source: true },
  params: [{ name: "query", type: "string", required: true }]
};

const prototype = inherits(Core, Transform);

prototype.transform = async function(_, pulse) {
  if (!this._session) {
    throw Error("OmniSci Core session missing. Please assign it to the vega transform by calling `CoreTransform.session(session).`");
  }

  const result = await this._session.queryAsync(_.query);

  result.forEach(ingest);

  const out = pulse.fork(pulse.NO_FIELDS & pulse.NO_SOURCE);
  out.rem = this.value;
  this.value = out.add = out.source = result;

  return out;
};
