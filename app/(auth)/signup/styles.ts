//qcgabay/app/(auth)/signup/styles.ts

import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },

  scrollContainer: { flexGrow: 1, paddingBottom: 40 },

  topSection: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },

  logoImage: { width: 120, height: 120 },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  initialState: {
    paddingVertical: 10,
    alignItems: "center",
  },

  primaryBtn: {
    backgroundColor: "#2D5A27",
    flexDirection: "row",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  loginSwitch: {
    flexDirection: "row",
    marginTop: 22,
  },

  switchText: {
    fontSize: 14,
    color: "#64748b",
  },

  switchLink: {
    fontSize: 14,
    color: "#2D5A27",
    fontWeight: "800",
  },

  form: { width: "100%" },

  formHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  inputIcon: { marginRight: 12 },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },

  registerBtn: {
    backgroundColor: "#D4AF37",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    alignItems: "center",
  },

  registerBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },

  backLink: {
    textAlign: "center",
    marginTop: 15,
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },

  orText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginHorizontal: 12,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialBox: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 14,
    width: "48%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  socialText: {
    marginLeft: 10,
    fontWeight: "700",
    color: "#334155",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  successCard: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2D5A27",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 8,
    borderColor: "#E9F5E8",
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },

  successSubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },

  boldText: {
    color: "#2D5A27",
    fontWeight: "800",
  },

  modalBtn: {
    backgroundColor: "#2D5A27",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },

  modalBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  guestOptionBtn: {
  marginTop: 20,
  padding: 10,
  alignItems: 'center',
},
guestOptionText: {
  color: '#2D5A27',
  fontSize: 15,
  fontWeight: '500',
  textDecorationLine: 'underline',
},
});