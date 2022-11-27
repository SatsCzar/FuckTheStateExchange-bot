// @ts-check
const tor_axios = require("tor-axios");

const baseUrl = "http://3nv24da5vu5bqiynzzb5t2regtk6erxzpuyppfkpow3v4lqgcee3hyyd.onion/api";

/** FuckTheState client. */
class FuckTheStateExchangeClient {
  
  /**
   * construct the class, connect to tor and make login.
   * @param {string} username
   * @param {string} password
   * @param {string} port
   * @param {string} controlPort
   */
  constructor(username, password, port, controlPort) {
    if (!username || !password) throw new Error("Username and Password is required");
    if (!port || !controlPort) throw new Error("port and controlPort is required");

    this.username = username;
    this.password = password;
    this.token = "";

    this._axios = tor_axios.torSetup({
      ip: "127.0.0.1",
      port,
      controlPort,
    });

    this._login();
  }

  async _login() {
    const doLogin = async () => {
      await this._axios
        .post(`${baseUrl}/login`, {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          this.token = data.token;
          this._axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    await doLogin();
    setInterval(() => {
      doLogin();
    }, 300000);
  }

  async getInfo() {
    return this._axios.get(`${baseUrl}/user/info`);
  }

  async getBook() {
    return this._axios.get(`${baseUrl}/api/book`);
  }

  async getBitcoinPrice() {
    return this._axios.get(`${baseUrl}/price/bitcoinbrl`);
  }

  async getNegociations() {
    const negociations = {
      buy: {},
      sell: {},
    };

    await Promise.all([
      this._axios
        .get(`${baseUrl}/negotiation/list/s`)
        .then(({ data }) => (negociations.sell = data)),
      this._axios
        .get(`${baseUrl}/negotiation/list/s`)
        .then(({ data }) => (negociations.buy = data)),
    ]);

    return negociations;
  }

  /**
   * Verify if has any waiting negociation
   * @return {Promise<Boolean>} true or false
   */
  async hasPendingNegociations() {
    return this._axios
      .get(`${baseUrl}/user/haswaitingnegotiation`)
      .then(({ data }) => data.has_waiting_negotiation);
  }

  async getBalance() {
    return this._axios.get(`${baseUrl}/wallet/balance`);
  }

  /**
   * Create a new invoice for deposit
   * @param {number} amount - Amount of bitcoins in btc
   * @return {Promise<{payment_hash: string, payment_request: string, checking_id: string}>} Invoice.
   */
  async newDeposit(amount) {
    return this._axios.get(`${baseUrl}/wallet/invoice/new/${amount}`);
  }

  /**
   * Verify deposit
   * @param {string} param - Hash or bolt11
   * @return {Promise<{paid: boolean, amount_msat: number, pending: boolean}>} Invoice.
   */
  async checkDeposit(param) {
    return this._axios.get(`${baseUrl}/walley/payment/check/${param}`);
  }

  /**
   * Create new order
   * @param {string} type - 'b' for buy and 's' for sell
   * @param {string} price - price in BRL (int value)
   * @param {string} amount - btc amount (in BTC)
   * @return {Promise<any>}.
   * @throws - Invalid type
   */
  async createOrder(type, price, amount) {
    if (type == "b" || type == "s") {
      return this._axios.post(`${baseUrl}/maker/new`, {
        btc_amount: amount,
        price,
        type,
      });
    }

    throw new Error("Invalid type");
  }
}

module.exports = FuckTheStateExchangeClient;
