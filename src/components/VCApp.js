import { useEffect, useState } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../utils/load-contract';

function VCApp() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });
    const [account, setAccount] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: null, age: null, dateOfBirth: null });
    const [newVaccine, setNewVaccine] = useState({ nameVaccine: null, date: null, vaccinationFacility: null });
    const [vaccineData, setVaccineData] = useState([]);
    const [loadInfo, setLoadInfo] = useState(false);

    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract('VC', provider);
            if (provider) {
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract
                });
            } else {
                console.log("Please install metamask!");
            }
        }
        loadProvider();
    }, []);

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);
        }
        web3Api.web3 && getAccount();
    }, [web3Api.web3]);

    const getInfo = async () => {
        web3Api.provider.request({ method: 'eth_requestAccounts' });
        const { contract } = web3Api;
        const u = await contract.getUser(account, {
            from: account
        });
        setUserInfo({
            name: u[0],
            age: u[1],
            dateOfBirth: u[2]
        });
        if (userInfo.name !== "null")
            setLoadInfo(true);
    }

    const updateInfo = async () => {
        const { contract } = web3Api;
        await contract.createUser(userInfo.name, userInfo.age, userInfo.dateOfBirth, { from: account });
    }

    const addVaccineHandler = async () => {
        const { contract } = web3Api;
        await contract.addVaccine(newVaccine.nameVaccine, newVaccine.date, newVaccine.vaccinationFacility, { from: account });
        setNewVaccine({ nameVaccine: null, date: null, vaccinationFacility: null });
    }

    const getVaccineData = async () => {
        const { contract } = web3Api;
        const data = await contract.readVaccine({
            from: account
        });
        const vcData = [];
        data.forEach(el => {
            vcData.push({
                nameVaccine: el['nameVaccine'],
                date: el['date'],
                vaccinationFacility: el['vaccinationFacility']
            });
        });
        setVaccineData(vcData);
    }

    return (
        <div className="vcapp-wrapper">
            <div className="vcapp mt-2">
                <h3>VCApp - H??? th???ng Blockchain l??u tr??? d??? li???u ti??m Vaccine</h3>
                <div className="box mt-1 vc-info">
                    <div className="vc-button-info">
                        {loadInfo ? (<button className="button is-warning" onClick={updateInfo}>C???p nh???t th??ng tin</button>) : (<button className="button is-info" onClick={() => {
                            getInfo();
                        }}>K???t n???i Metamask Wallet</button>)}
                    </div>
                    <div className="user-info">
                        <form>
                            <div className="field">
                                <label className="label">H??? v?? t??n</label>
                                <div className="control">
                                    <input className="input" type="text" onChange={(event) => {
                                        setUserInfo({ name: event.target.value, age: userInfo.age, dateOfBirth: userInfo.dateOfBirth });
                                    }} name="name" placeholder="name" value={userInfo.name ? userInfo.name : ""} />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Tu???i</label>
                                <div className="control">
                                    <input className="input" type="text" onChange={(event) => {
                                        setUserInfo({ name: userInfo.name, age: event.target.value, dateOfBirth: userInfo.dateOfBirth });
                                    }} name="age" placeholder="age" value={userInfo.age ? userInfo.age : ""} />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Ng??y sinh</label>
                                <div className="control">
                                    <input className="input" type="text" onChange={(event) => {
                                        setUserInfo({ name: userInfo.name, age: userInfo.age, dateOfBirth: event.target.value });
                                    }} name="dateOfBirth" placeholder="dateOfBirth" value={userInfo.dateOfBirth ? userInfo.dateOfBirth : ""} />
                                </div>
                            </div>
                            <p>Address: {account ? account : "null"}</p>
                        </form>
                    </div>
                </div>
                {loadInfo ? (
                    <div className="box mt-1">
                        <div className="add-vaccine">
                            <form>
                                <div className="field">
                                    <label className="label">T??n vaccine</label>
                                    <div className="control">
                                        <input className="input" type="text" onChange={(event) => {
                                            setNewVaccine({ nameVaccine: event.target.value, date: newVaccine.date, vaccinationFacility: newVaccine.vaccinationFacility });
                                        }} name="nameVaccine" placeholder="name" value={newVaccine.nameVaccine ? newVaccine.nameVaccine : ""} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Ng??y ti??m</label>
                                    <div className="control">
                                        <input className="input" type="text" onChange={(event) => {
                                            setNewVaccine({ nameVaccine: newVaccine.nameVaccine, date: event.target.value, vaccinationFacility: newVaccine.vaccinationFacility });
                                        }} name="date" placeholder="date" value={newVaccine.date ? newVaccine.date : ""} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">C?? s??? ti??m</label>
                                    <div className="control">
                                        <input className="input" type="text" onChange={(event) => {
                                            setNewVaccine({ nameVaccine: newVaccine.nameVaccine, date: newVaccine.date, vaccinationFacility: event.target.value });
                                        }} name="vaccinationFacility" placeholder="vaccinationFacility" value={newVaccine.vaccinationFacility ? newVaccine.vaccinationFacility : ""} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="vc-button-info mt-2">
                            <button className="button is-success" onClick={addVaccineHandler}>Th??m m??i ti??m</button>
                        </div>
                    </div>
                ) : ""}

            </div>
            {loadInfo ? (<div className="vc-vaccine-info mt-2 ml-2">
                <h3>D??? li???u ti??m vaccine c???a b???n</h3>
                <div className="box mt-1">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>T??n vaccine</th>
                                <th>Ng??y ti??m</th>
                                <th>C?? s??? ti??m</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                vaccineData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.nameVaccine}</td>
                                        <td>{data.date}</td>
                                        <td>{data.vaccinationFacility}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button className="button is-primary" onClick={getVaccineData}>L???y d??? li???u vaccine</button>
                </div>
            </div>) : ""}
        </div>
    );
}

export default VCApp;