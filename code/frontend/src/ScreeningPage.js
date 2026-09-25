import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

const SCREENING_API = "https://backend-production-b77da.up.railway.app/api/screenings";
const DONOR_API = "https://backend-production-b77da.up.railway.app/api/donor-management";

const initialForm = {
  donorId: "",
  hemoglobin: "",
  weight: "",
  bloodPressure: "",
  temperature: "",
  pulseRate: "",
  medicalHistory: "",
  eligibilityStatus: "ELIGIBLE",
  remarks: ""
};

// ============================================================
// GET JWT TOKEN
// ============================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    ""
  );
};

// ============================================================
// AUTH HEADERS
// ============================================================

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {})
  };
};

function ScreeningPage() {
  const [donors, setDonors] = useState([]);
  const [screenings, setScreenings] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [selectedDonor, setSelectedDonor] = useState(null);

  const [donorSearch, setDonorSearch] = useState("");
  const [showDonors, setShowDonors] = useState(false);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // HANDLE AUTH ERROR
  // ==========================================================

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
        setError(
            "Access denied. Please log in again with an authorized account."
        );

        return true;
    }

    return false;
}, []);

  // ==========================================================
  // LOAD DONORS
  // ==========================================================

  const loadDonors = useCallback(async () => {
    try {
        const response = await fetch(DONOR_API, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (handleAuthError(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                `Unable to load donors. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        let donorList = [];

        if (Array.isArray(data)) {
            donorList = data;
        } else if (data && Array.isArray(data.data)) {
            donorList = data.data;
        } else if (data && Array.isArray(data.content)) {
            donorList = data.content;
        }

        setDonors(donorList);

        console.log("Donors:", donorList);
    } catch (err) {
        console.error("Donor loading error:", err);

        setError(
            err.message || "Unable to load donors."
        );
    }
}, [handleAuthError]);
  


  // ==========================================================
  // LOAD SCREENINGS
  // ==========================================================

  const loadScreenings = useCallback(async () => {
    try {
        setLoading(true);

        const response = await fetch(SCREENING_API, {
            method: "GET",
            headers: getAuthHeaders()
        });

        console.log(
            "Screening API status:",
            response.status
        );

        if (handleAuthError(response)) {
            setScreenings([]);
            return;
        }

        if (!response.ok) {
            const text = await response.text();

            throw new Error(
                text ||
                    `Unable to load screenings. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "Screenings API response:",
            data
        );

        let screeningList = [];

        if (Array.isArray(data)) {
            screeningList = data;
        } else if (
            data &&
            Array.isArray(data.data)
        ) {
            screeningList = data.data;
        } else if (
            data &&
            Array.isArray(data.content)
        ) {
            screeningList = data.content;
        }

        setScreenings(screeningList);
    } catch (err) {
        console.error(
            "Screening loading error:",
            err
        );

        setScreenings([]);

        setError(
            err.message ||
                "Unable to load screening records."
        );
    } finally {
        setLoading(false);
    }
}, [handleAuthError]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDonors();
    loadScreenings();
}, [loadDonors, loadScreenings]);

  // ==========================================================
  // FILTER DONORS
  // ==========================================================

  const filteredDonors = useMemo(() => {
    const value = donorSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return donors.slice(0, 10);
    }

    return donors
      .filter((donor) => {
        const name =
          donor.fullName ||
          donor.name ||
          donor.donorName ||
          "";

        const id =
          donor.donorId?.toString() ||
          "";

        const bloodGroup =
          donor.bloodGroup ||
          "";

        return (
          name
            .toLowerCase()
            .includes(value) ||
          id.includes(value) ||
          bloodGroup
            .toLowerCase()
            .includes(value)
        );
      })
      .slice(0, 10);
  }, [donors, donorSearch]);

  // ==========================================================
  // GET DONOR NAME
  // ==========================================================

  const getDonorName = (donor) => {
    if (!donor) {
      return "Unknown Donor";
    }

    return (
      donor.fullName ||
      donor.name ||
      donor.donorName ||
      "Unknown Donor"
    );
  };

  // ==========================================================
  // GET BLOOD GROUP
  // ==========================================================

  const getBloodGroup = (donor) => {
    if (!donor?.bloodGroup) {
      return "—";
    }

    return donor.bloodGroup
      .replace("_POSITIVE", "+")
      .replace("_NEGATIVE", "-");
  };

  // ==========================================================
  // SELECT DONOR
  // ==========================================================

  const selectDonor = (donor) => {
    setSelectedDonor(donor);

    setForm((previous) => ({
      ...previous,
      donorId: donor.donorId
    }));

    setDonorSearch(
      getDonorName(donor)
    );

    setShowDonors(false);

    setError("");
  };

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm(initialForm);

    setSelectedDonor(null);

    setDonorSearch("");

    setEditingId(null);

    setShowDonors(false);
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    if (!form.donorId) {
      return "Please select a donor.";
    }

    if (!form.hemoglobin) {
      return "Please enter hemoglobin.";
    }

    if (!form.weight) {
      return "Please enter donor weight.";
    }

    if (!form.bloodPressure) {
      return "Please enter blood pressure.";
    }

    if (!form.temperature) {
      return "Please enter temperature.";
    }

    if (!form.pulseRate) {
      return "Please enter pulse rate.";
    }

    return null;
  };

  // ==========================================================
  // SAVE SCREENING
  // ==========================================================

  const saveScreening = async () => {
    setMessage("");
    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${SCREENING_API}/${editingId}`
        : `${SCREENING_API}/${form.donorId}`;

      const method = editingId
        ? "PUT"
        : "POST";

      const body = {
        hemoglobin:
          Number(form.hemoglobin),

        weight:
          Number(form.weight),

        bloodPressure:
          form.bloodPressure,

        temperature:
          Number(form.temperature),

        pulseRate:
          Number(form.pulseRate),

        medicalHistory:
          form.medicalHistory,

        eligibilityStatus:
          form.eligibilityStatus,

        remarks:
          form.remarks
      };

      console.log(
        "Saving screening:",
        body
      );

      const response = await fetch(
        url,
        {
          method,
          headers:
            getAuthHeaders(),
          body:
            JSON.stringify(body)
        }
      );

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Unable to save screening. HTTP ${response.status}`
        );
      }

      setMessage(
        editingId
          ? "Screening updated successfully."
          : "Screening saved successfully."
      );

      resetForm();

      await loadScreenings();
    } catch (err) {
      console.error(
        "Save screening error:",
        err
      );

      setError(
        err.message ||
          "Unable to save screening."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // EDIT SCREENING
  // ==========================================================

  const editScreening = (screening) => {
    const donor =
      screening.donor;

    setEditingId(
      screening.screeningId
    );

    setForm({
      donorId:
        donor?.donorId ||
        screening.donorId ||
        "",

      hemoglobin:
        screening.hemoglobin ?? "",

      weight:
        screening.weight ?? "",

      bloodPressure:
        screening.bloodPressure ?? "",

      temperature:
        screening.temperature ?? "",

      pulseRate:
        screening.pulseRate ?? "",

      medicalHistory:
        screening.medicalHistory ?? "",

      eligibilityStatus:
        screening.eligibilityStatus ||
        "ELIGIBLE",

      remarks:
        screening.remarks ?? ""
    });

    if (donor) {
      setSelectedDonor(donor);

      setDonorSearch(
        getDonorName(donor)
      );
    }

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ==========================================================
  // DELETE SCREENING
  // ==========================================================

  const deleteScreening = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this screening?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${SCREENING_API}/${id}`,
          {
            method: "DELETE",
            headers:
              getAuthHeaders()
          }
        );

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Unable to delete screening."
        );
      }

      setMessage(
        "Screening deleted successfully."
      );

      await loadScreenings();
    } catch (err) {
      console.error(
        "Delete screening error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete screening."
      );
    }
  };

  // ==========================================================
  // SEARCH SCREENINGS
  // ==========================================================

  const filteredScreenings =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return screenings;
      }

      return screenings.filter(
        (screening) => {
          const donor =
            screening.donor;

          const name =
            getDonorName(donor)
              .toLowerCase();

          const donorId =
            (
              donor?.donorId ||
              screening.donorId ||
              ""
            )
              .toString()
              .toLowerCase();

          const bloodGroup =
            getBloodGroup(donor)
              .toLowerCase();

          const status =
            (
              screening.eligibilityStatus ||
              ""
            ).toLowerCase();

          return (
            name.includes(value) ||
            donorId.includes(value) ||
            bloodGroup.includes(value) ||
            status.includes(value)
          );
        }
      );
    }, [screenings, search]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const total =
    screenings.length;

  const eligible =
    screenings.filter(
      (screening) =>
        screening.eligibilityStatus ===
        "ELIGIBLE"
    ).length;

  const deferred =
    screenings.filter(
      (screening) =>
        screening.eligibilityStatus ===
        "TEMPORARILY_DEFERRED"
    ).length;

  const rejected =
    screenings.filter(
      (screening) =>
        screening.eligibilityStatus ===
        "PERMANENTLY_REJECTED"
    ).length;

  // ==========================================================
  // STATUS TEXT
  // ==========================================================

  const getStatusText = (
    status
  ) => {
    if (status === "ELIGIBLE") {
      return "Eligible";
    }

    if (
      status ===
      "TEMPORARILY_DEFERRED"
    ) {
      return "Temporarily Deferred";
    }

    if (
      status ===
      "PERMANENTLY_REJECTED"
    ) {
      return "Permanently Rejected";
    }

    return status || "Unknown";
  };

  // ==========================================================
  // DATE
  // ==========================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "—";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <style>{styles}</style>

      <div className="screening-page">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="page-header">

          <div className="title-area">

            <div className="title-icon">
              🩺
            </div>

            <div>
              <h1>
                Donor Screening
              </h1>

              <p>
                Health assessment and
                donor eligibility management
              </p>
            </div>

          </div>

        </div>


        {/* ==================================================
            ALERTS
        ================================================== */}

        {message && (
          <div className="alert success-alert">

            <span>✓</span>

            <span>
              {message}
            </span>

            <button
              onClick={() =>
                setMessage("")
              }
            >
              ×
            </button>

          </div>
        )}

        {error && (
          <div className="alert error-alert">

            <span>!</span>

            <span>
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="stats">

          <Stat
            icon="🩺"
            title="TOTAL SCREENINGS"
            value={total}
            type="purple"
          />

          <Stat
            icon="✓"
            title="ELIGIBLE"
            value={eligible}
            type="green"
          />

          <Stat
            icon="⏳"
            title="TEMPORARILY DEFERRED"
            value={deferred}
            type="orange"
          />

          <Stat
            icon="!"
            title="PERMANENTLY REJECTED"
            value={rejected}
            type="red"
          />

        </div>


        {/* ==================================================
            NEW SCREENING
        ================================================== */}

        <div className="form-card">

          <div className="card-header">

            <div>
              <h2>
                {editingId
                  ? "Update Screening"
                  : "New Donor Screening"}
              </h2>

              <p>
                Search and select the donor
                before entering the health
                assessment.
              </p>
            </div>

            {editingId && (
              <button
                className="cancel-edit"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>


          <div className="form-body">

            {/* DONOR SEARCH */}

            <div className="field donor-field">

              <label>
                Donor
                <span className="required">
                  *
                </span>
              </label>

              <div className="donor-search-box">

                <span className="search-icon">
                  🔍
                </span>

                <input
                  type="text"
                  value={
                    donorSearch
                  }
                  disabled={
                    !!editingId
                  }
                  placeholder={
                    "Search donor by name, ID or blood group..."
                  }
                  onFocus={() => {
                    if (!editingId) {
                      setShowDonors(
                        true
                      );
                    }
                  }}
                  onChange={(event) => {

                    setDonorSearch(
                      event.target.value
                    );

                    setShowDonors(
                      true
                    );

                    if (
                      selectedDonor &&
                      event.target.value !==
                        getDonorName(
                          selectedDonor
                        )
                    ) {
                      setSelectedDonor(
                        null
                      );

                      setForm(
                        (previous) => ({
                          ...previous,
                          donorId: ""
                        })
                      );
                    }

                  }}
                />

                {donorSearch &&
                  !editingId && (
                    <button
                      className="clear-search"
                      onClick={() => {

                        setDonorSearch(
                          ""
                        );

                        setSelectedDonor(
                          null
                        );

                        setForm(
                          (previous) => ({
                            ...previous,
                            donorId: ""
                          })
                        );

                      }}
                    >
                      ×
                    </button>
                  )}

              </div>


              {/* DONOR DROPDOWN */}

              {showDonors &&
                !editingId && (
                  <div className="donor-dropdown">

                    {filteredDonors.length ===
                    0 ? (
                      <div className="no-donors">
                        No donors found.
                      </div>
                    ) : (
                      filteredDonors.map(
                        (donor) => (
                          <button
                            type="button"
                            className="donor-option"
                            key={
                              donor.donorId
                            }
                            onClick={() =>
                              selectDonor(
                                donor
                              )
                            }
                          >

                            <div className="option-avatar">
                              {getDonorName(
                                donor
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="option-info">

                              <strong>
                                {getDonorName(
                                  donor
                                )}
                              </strong>

                              <span>
                                Donor ID #
                                {
                                  donor.donorId
                                }
                              </span>

                            </div>

                            <span className="option-blood">
                              🩸{" "}
                              {getBloodGroup(
                                donor
                              )}
                            </span>

                          </button>
                        )
                      )
                    )}

                  </div>
                )}

            </div>


            {/* SELECTED DONOR */}

            {selectedDonor && (
              <div className="selected-donor">

                <div className="selected-avatar">
                  {getDonorName(
                    selectedDonor
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="selected-info">

                  <span>
                    SELECTED DONOR
                  </span>

                  <strong>
                    {getDonorName(
                      selectedDonor
                    )}
                  </strong>

                </div>

                <div className="donor-detail">

                  <small>
                    DONOR ID
                  </small>

                  <strong>
                    #
                    {
                      selectedDonor.donorId
                    }
                  </strong>

                </div>

                <div className="donor-detail blood">

                  <small>
                    BLOOD GROUP
                  </small>

                  <strong>
                    🩸{" "}
                    {getBloodGroup(
                      selectedDonor
                    )}
                  </strong>

                </div>

              </div>
            )}


            {/* HEALTH FIELDS */}

            <div className="fields-grid">

              <InputField
                label="Hemoglobin"
                unit="g/dL"
                icon="🩸"
                name="hemoglobin"
                type="number"
                step="0.1"
                placeholder="e.g. 13.5"
                value={
                  form.hemoglobin
                }
                onChange={
                  handleChange
                }
              />

              <InputField
                label="Weight"
                unit="kg"
                icon="⚖️"
                name="weight"
                type="number"
                step="0.1"
                placeholder="e.g. 56"
                value={
                  form.weight
                }
                onChange={
                  handleChange
                }
              />

              <InputField
                label="Blood Pressure"
                icon="❤️"
                name="bloodPressure"
                placeholder="e.g. 118/60"
                value={
                  form.bloodPressure
                }
                onChange={
                  handleChange
                }
              />

              <InputField
                label="Temperature"
                unit="°C"
                icon="🌡️"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="e.g. 37"
                value={
                  form.temperature
                }
                onChange={
                  handleChange
                }
              />

              <InputField
                label="Pulse Rate"
                unit="bpm"
                icon="💓"
                name="pulseRate"
                type="number"
                placeholder="e.g. 72"
                value={
                  form.pulseRate
                }
                onChange={
                  handleChange
                }
              />

              <div className="field">

                <label>
                  Eligibility Status
                  <span className="required">
                    *
                  </span>
                </label>

                <div className="input-box">

                  <span>
                    ✓
                  </span>

                  <select
                    name="eligibilityStatus"
                    value={
                      form.eligibilityStatus
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="ELIGIBLE">
                      Eligible
                    </option>

                    <option value="TEMPORARILY_DEFERRED">
                      Temporarily Deferred
                    </option>

                    <option value="PERMANENTLY_REJECTED">
                      Permanently Rejected
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* MEDICAL HISTORY */}

            <div className="field">

              <label>
                Medical History
              </label>

              <textarea
                name="medicalHistory"
                value={
                  form.medicalHistory
                }
                onChange={
                  handleChange
                }
                placeholder="Enter relevant medical history..."
              />

            </div>


            {/* REMARKS */}

            <div className="field">

              <label>
                Screening Remarks
              </label>

              <textarea
                name="remarks"
                value={
                  form.remarks
                }
                onChange={
                  handleChange
                }
                placeholder="Enter screening observations..."
              />

            </div>

          </div>


          {/* FORM FOOTER */}

          <div className="form-footer">

            <div className="secure-text">
              🔒 Screening information is securely
              stored in the BBMS database.
            </div>

            <div className="buttons">

              {editingId && (
                <button
                  className="secondary-button"
                  onClick={
                    resetForm
                  }
                >
                  Cancel
                </button>
              )}

              <button
                className="save-button"
                onClick={
                  saveScreening
                }
                disabled={
                  saving
                }
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "✓ Update Screening"
                  : "+ Save Screening"}
              </button>

            </div>

          </div>

        </div>


        {/* ==================================================
            SCREENING RECORDS
        ================================================== */}

        <div className="records-card">

          <div className="records-header">

            <div>
              <h2>
                Screening Records
              </h2>

              <p>
                {
                  filteredScreenings.length
                } screening
                {
                  filteredScreenings.length !==
                  1
                    ? "s"
                    : ""
                } displayed
              </p>
            </div>

            <div className="record-tools">

              <div className="table-search">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search donor name, ID or blood group..."
                />

              </div>

              <button
                className="refresh-button"
                onClick={() => {
                  setError("");
                  loadDonors();
                  loadScreenings();
                }}
              >
                ↻ Refresh
              </button>

            </div>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    DONOR
                  </th>

                  <th>
                    BLOOD GROUP
                  </th>

                  <th>
                    HEALTH CHECK
                  </th>

                  <th>
                    VITALS
                  </th>

                  <th>
                    ELIGIBILITY
                  </th>

                  <th>
                    SCREENING DATE
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty"
                    >
                      Loading screening
                      records...
                    </td>
                  </tr>
                ) : filteredScreenings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty"
                    >

                      <div className="empty-icon">
                        🩺
                      </div>

                      <strong>
                        No screening records
                      </strong>

                      <span>
                        No records were returned
                        from the server.
                      </span>

                    </td>
                  </tr>
                ) : (
                  filteredScreenings.map(
                    (screening) => {

                      const donor =
                        screening.donor;

                      const status =
                        screening.eligibilityStatus;

                      return (
                        <tr
                          key={
                            screening.screeningId
                          }
                        >

                          {/* DONOR */}

                          <td>

                            <div className="table-donor">

                              <div className="table-avatar">
                                {getDonorName(
                                  donor
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <strong>
                                  {getDonorName(
                                    donor
                                  )}
                                </strong>

                                <small>
                                  Donor ID #
                                  {
                                    donor?.donorId ||
                                    screening.donorId ||
                                    "—"
                                  }
                                </small>

                              </div>

                            </div>

                          </td>


                          {/* BLOOD GROUP */}

                          <td>

                            <span className="blood-badge">
                              🩸{" "}
                              {getBloodGroup(
                                donor
                              )}
                            </span>

                          </td>


                          {/* HEALTH */}

                          <td>

                            <div className="health">

                              <span>
                                <b>Hb</b>{" "}
                                {
                                  screening.hemoglobin ??
                                  "—"
                                }{" "}
                                g/dL
                              </span>

                              <span>
                                <b>Weight</b>{" "}
                                {
                                  screening.weight ??
                                  "—"
                                }{" "}
                                kg
                              </span>

                            </div>

                          </td>


                          {/* VITALS */}

                          <td>

                            <div className="vitals">

                              <span>
                                ❤️{" "}
                                {
                                  screening.bloodPressure ||
                                  "—"
                                }
                              </span>

                              <span>
                                🌡️{" "}
                                {
                                  screening.temperature ??
                                  "—"
                                }°C
                              </span>

                              <span>
                                💓{" "}
                                {
                                  screening.pulseRate ??
                                  "—"
                                } bpm
                              </span>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`status ${
                                status ===
                                "ELIGIBLE"
                                  ? "eligible"
                                  : status ===
                                    "TEMPORARILY_DEFERRED"
                                  ? "deferred"
                                  : "rejected"
                              }`}
                            >

                              <i />

                              {getStatusText(
                                status
                              )}

                            </span>

                          </td>


                          {/* DATE */}

                          <td>
                            {formatDate(
                              screening.screeningDate
                            )}
                          </td>


                          {/* ACTION */}

                          <td>

                            <div className="actions">

                              <button
                                className="edit"
                                onClick={() =>
                                  editScreening(
                                    screening
                                  )
                                }
                                title="Edit"
                              >
                                ✎
                              </button>

                              <button
                                className="delete"
                                onClick={() =>
                                  deleteScreening(
                                    screening.screeningId
                                  )
                                }
                                title="Delete"
                              >
                                🗑
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}


// ============================================================
// STAT COMPONENT
// ============================================================

function Stat({
  icon,
  title,
  value,
  type
}) {
  return (
    <div
      className={`stat ${type}`}
    >

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


// ============================================================
// INPUT COMPONENT
// ============================================================

function InputField({
  label,
  unit,
  icon,
  name,
  type = "text",
  step,
  placeholder,
  value,
  onChange
}) {
  return (
    <div className="field">

      <label>

        {label}

        {unit && (
          <small>
            {" "}({unit})
          </small>
        )}

        <span className="required">
          *
        </span>

      </label>

      <div className="input-box">

        <span>
          {icon}
        </span>

        <input
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

      </div>

    </div>
  );
}


// ============================================================
// CSS
// ============================================================

const styles = `

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    "Segoe UI",
    Arial,
    sans-serif;
  background: #f3f6ff;
  color: #172033;
}

.screening-page {
  min-height: 100vh;
  padding: 30px 38px 60px;
  background:
    linear-gradient(
      135deg,
      #f3f6ff,
      #edf2ff,
      #f8f9ff
    );
}

.page-header {
  max-width: 1550px;
  margin: 0 auto 24px;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 17px;
}

.title-icon {
  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );

  font-size: 31px;

  box-shadow:
    0 10px 25px
    rgba(79,70,229,.22);
}

.title-area h1 {
  margin: 0;

  font-size: 36px;

  color: #172554;

  font-weight: 800;
}

.title-area p {
  margin: 5px 0 0;

  color: #64748b;

  font-size: 16px;
}


/* ALERTS */

.alert {
  max-width: 1550px;
  margin: 0 auto 17px;

  padding: 13px 17px;

  display: flex;
  align-items: center;

  gap: 10px;

  border-radius: 9px;

  font-weight: 600;
}

.alert button {
  margin-left: auto;

  border: none;

  background: transparent;

  font-size: 20px;

  cursor: pointer;
}

.success-alert {
  background: #f0fdf4;
  color: #15803d;

  border: 1px solid #bbf7d0;
}

.error-alert {
  background: #fef2f2;
  color: #b91c1c;

  border: 1px solid #fecaca;
}


/* STATS */

.stats {
  max-width: 1550px;

  margin: 0 auto 23px;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 17px;
}

.stat {
  min-height: 108px;

  display: flex;
  align-items: center;

  gap: 16px;

  padding: 20px;

  background: white;

  border: 1px solid #dfe5f1;

  border-radius: 14px;

  box-shadow:
    0 7px 22px
    rgba(15,23,42,.06);
}

.stat-icon {
  width: 55px;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 23px;
}

.stat span {
  display: block;

  color: #64748b;

  font-size: 11px;

  font-weight: 800;
}

.stat strong {
  display: block;

  margin-top: 4px;

  font-size: 31px;
}

.purple .stat-icon {
  background: #eef2ff;
}

.purple strong {
  color: #4f46e5;
}

.green .stat-icon {
  background: #ecfdf5;
}

.green strong {
  color: #16a34a;
}

.orange .stat-icon {
  background: #fff7ed;
}

.orange strong {
  color: #ea580c;
}

.red .stat-icon {
  background: #fef2f2;
}

.red strong {
  color: #dc2626;
}


/* CARDS */

.form-card,
.records-card {
  max-width: 1550px;

  margin: 0 auto 24px;

  background: white;

  border: 1px solid #dfe5f1;

  border-radius: 16px;

  box-shadow:
    0 8px 25px
    rgba(15,23,42,.07);
}

.form-card {
  overflow: visible;
}

.records-card {
  overflow: hidden;
}

.card-header,
.records-header {
  padding: 22px 25px;

  display: flex;
  align-items: center;

  justify-content: space-between;

  border-bottom:
    1px solid #edf1f7;
}

.card-header h2,
.records-header h2 {
  margin: 0;

  font-size: 22px;

  color: #1e293b;
}

.card-header p,
.records-header p {
  margin: 5px 0 0;

  color: #94a3b8;

  font-size: 14px;
}

.cancel-edit {
  padding: 10px 15px;

  border: none;

  border-radius: 8px;

  background: #fef2f2;

  color: #dc2626;

  font-weight: 700;

  cursor: pointer;
}


/* FORM */

.form-body {
  padding: 25px;
}

.field {
  position: relative;

  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-bottom: 20px;
}

.field label {
  font-size: 13px;

  font-weight: 800;

  color: #334155;
}

.field label small {
  color: #94a3b8;

  font-weight: 500;
}

.required {
  color: #ef4444;

  margin-left: 3px;
}

.fields-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 19px;
}

.input-box {
  height: 48px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 13px;

  background: #fbfcff;

  border:
    1px solid #d7deeb;

  border-radius: 9px;
}

.input-box:focus-within {
  background: white;

  border-color: #6366f1;

  box-shadow:
    0 0 0 3px
    rgba(99,102,241,.1);
}

.input-box > span {
  font-size: 16px;
}

.input-box input,
.input-box select {
  width: 100%;

  height: 100%;

  border: none;

  outline: none;

  background: transparent;

  font-size: 14px;

  color: #334155;
}

.field textarea {
  min-height: 88px;

  padding: 13px;

  resize: vertical;

  border:
    1px solid #d7deeb;

  border-radius: 9px;

  outline: none;

  background: #fbfcff;

  font-family: inherit;

  font-size: 14px;
}

.field textarea:focus {
  background: white;

  border-color: #6366f1;

  box-shadow:
    0 0 0 3px
    rgba(99,102,241,.1);
}


/* DONOR SEARCH */

.donor-field {
  z-index: 20;
}

.donor-search-box {
  height: 52px;

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 0 14px;

  background: #fbfcff;

  border:
    1px solid #cfd8e8;

  border-radius: 10px;
}

.donor-search-box:focus-within {
  background: white;

  border-color: #6366f1;

  box-shadow:
    0 0 0 3px
    rgba(99,102,241,.1);
}

.search-icon {
  font-size: 18px;
}

.donor-search-box input {
  width: 100%;

  height: 100%;

  border: none;

  outline: none;

  background: transparent;

  font-size: 15px;
}

.clear-search {
  border: none;

  background: transparent;

  color: #94a3b8;

  font-size: 22px;

  cursor: pointer;
}

.donor-dropdown {
  position: absolute;

  top: 78px;

  left: 0;

  right: 0;

  max-height: 330px;

  overflow-y: auto;

  background: white;

  border:
    1px solid #dce3f1;

  border-radius: 11px;

  box-shadow:
    0 15px 35px
    rgba(15,23,42,.15);

  z-index: 100;
}

.donor-option {
  width: 100%;

  padding: 12px 14px;

  display: flex;

  align-items: center;

  gap: 12px;

  border: none;

  border-bottom:
    1px solid #edf1f7;

  background: white;

  text-align: left;

  cursor: pointer;
}

.donor-option:hover {
  background: #f5f7ff;
}

.option-avatar {
  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: #eef2ff;

  color: #4f46e5;

  font-weight: 800;
}

.option-info {
  flex: 1;
}

.option-info strong {
  display: block;

  color: #1e293b;

  font-size: 14px;
}

.option-info span {
  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 12px;
}

.option-blood {
  padding: 6px 9px;

  border-radius: 7px;

  background: #f3e8ff;

  color: #7c3aed;

  font-size: 12px;

  font-weight: 800;
}

.no-donors {
  padding: 22px;

  text-align: center;

  color: #94a3b8;
}


/* SELECTED DONOR */

.selected-donor {
  margin-bottom: 23px;

  padding: 16px 18px;

  display: flex;

  align-items: center;

  gap: 13px;

  background:
    linear-gradient(
      90deg,
      #f5f3ff,
      #f8faff
    );

  border:
    1px solid #ddd6fe;

  border-radius: 12px;
}

.selected-avatar {
  width: 50px;

  height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );

  color: white;

  font-size: 20px;

  font-weight: 800;
}

.selected-info {
  min-width: 220px;
}

.selected-info span,
.donor-detail small {
  display: block;

  color: #8b5cf6;

  font-size: 10px;

  font-weight: 800;
}

.selected-info strong {
  display: block;

  margin-top: 3px;

  color: #1e293b;

  font-size: 16px;
}

.donor-detail {
  padding-left: 22px;

  border-left:
    1px solid #ddd6fe;
}

.donor-detail strong {
  display: block;

  margin-top: 4px;

  color: #334155;

  font-size: 14px;
}

.donor-detail.blood strong {
  color: #db2777;
}


/* FOOTER */

.form-footer {
  padding: 17px 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #fafbff;

  border-top:
    1px solid #edf1f7;
}

.secure-text {
  color: #7c8aa3;

  font-size: 12px;
}

.buttons {
  display: flex;

  gap: 9px;
}

.secondary-button,
.save-button {
  padding: 11px 18px;

  border: none;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}

.secondary-button {
  background: #f1f5f9;

  color: #475569;
}

.save-button {
  color: white;

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #6366f1
    );

  box-shadow:
    0 6px 15px
    rgba(79,70,229,.2);
}

.save-button:disabled {
  opacity: .6;

  cursor: not-allowed;
}


/* RECORDS */

.record-tools {
  display: flex;

  gap: 10px;
}

.table-search {
  width: 320px;

  height: 43px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 0 13px;

  background: #fbfcff;

  border:
    1px solid #d7deeb;

  border-radius: 8px;
}

.table-search input {
  width: 100%;

  border: none;

  outline: none;

  background: transparent;

  font-size: 13px;
}

.refresh-button {
  padding: 0 15px;

  border: none;

  border-radius: 8px;

  background: #eef2ff;

  color: #4f46e5;

  font-weight: 800;

  cursor: pointer;
}


/* TABLE */

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;

  min-width: 1250px;

  border-collapse: collapse;
}

thead {
  background:
    linear-gradient(
      90deg,
      #1e3a8a,
      #3730a3
    );
}

th {
  padding: 16px;

  color: white;

  text-align: left;

  font-size: 11px;

  letter-spacing: .04em;
}

td {
  padding: 15px 16px;

  border-bottom:
    1px solid #e8edf5;

  color: #475569;

  font-size: 13px;
}

tbody tr:hover {
  background: #f8faff;
}


/* TABLE DONOR */

.table-donor {
  display: flex;

  align-items: center;

  gap: 11px;
}

.table-avatar {
  width: 43px;

  height: 43px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background: #eef2ff;

  color: #4f46e5;

  font-weight: 800;

  font-size: 16px;
}

.table-donor strong {
  display: block;

  color: #1e293b;

  font-size: 14px;
}

.table-donor small {
  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 11px;
}


/* BLOOD */

.blood-badge {
  display: inline-block;

  padding: 7px 11px;

  border-radius: 8px;

  background: #f3e8ff;

  color: #7c3aed;

  font-size: 12px;

  font-weight: 800;
}


/* HEALTH */

.health,
.vitals {
  display: flex;

  flex-direction: column;

  gap: 5px;
}

.health span,
.vitals span {
  font-size: 12px;
}

.health b {
  color: #4f46e5;
}


/* STATUS */

.status {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 7px 10px;

  border-radius: 20px;

  font-size: 11px;

  font-weight: 800;
}

.status i {
  width: 7px;

  height: 7px;

  border-radius: 50%;
}

.eligible {
  color: #15803d;

  background: #dcfce7;
}

.eligible i {
  background: #16a34a;
}

.deferred {
  color: #c2410c;

  background: #ffedd5;
}

.deferred i {
  background: #f97316;
}

.rejected {
  color: #b91c1c;

  background: #fee2e2;
}

.rejected i {
  background: #ef4444;
}


/* ACTIONS */

.actions {
  display: flex;

  gap: 7px;
}

.actions button {
  width: 35px;

  height: 35px;

  border: none;

  border-radius: 7px;

  cursor: pointer;

  font-size: 14px;
}

.edit {
  background: #eef2ff;

  color: #4f46e5;
}

.delete {
  background: #fee2e2;

  color: #dc2626;
}


/* EMPTY */

.empty {
  padding: 65px !important;

  text-align: center;

  color: #94a3b8;
}

.empty-icon {
  font-size: 38px;

  margin-bottom: 10px;
}

.empty strong {
  display: block;

  color: #334155;

  font-size: 17px;
}

.empty span {
  display: block;

  margin-top: 5px;

  font-size: 13px;
}


/* RESPONSIVE */

@media (max-width: 1100px) {

  .stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .fields-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}

@media (max-width: 700px) {

  .screening-page {
    padding: 20px 14px 40px;
  }

  .title-area h1 {
    font-size: 29px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .selected-donor {
    align-items: flex-start;

    flex-wrap: wrap;
  }

  .donor-detail {
    border-left: none;

    padding-left: 0;
  }

  .form-footer,
  .records-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 15px;
  }

  .record-tools {
    width: 100%;

    flex-direction: column;
  }

  .table-search {
    width: 100%;
  }

  .refresh-button {
    height: 43px;
  }

}

`;

export default ScreeningPage;
