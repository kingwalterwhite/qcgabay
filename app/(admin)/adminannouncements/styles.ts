// QCGabay/app/(admin)/announcements/styles.ts

import { StyleSheet } from "react-native";
import { styles as UserStyles } from "../users/styles";

export const styles = StyleSheet.create({
  ...UserStyles,

  cardMetadata: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },

  timestampContainer: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  createdText: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },

  updatedText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  bulkActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  selectAllText: {
    fontSize: 14,
    color: "#1d50a2",
    marginLeft: 4,
  },

  bulkButtonsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1d50a2",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  secondaryButtonText: {
    color: "#1d50a2",
    marginLeft: 4,
    fontSize: 13,
  },

  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  disabledButton: {
    opacity: 0.5,
  },

  dangerButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 13,
  },

  checkboxWrap: {
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  notification: {
  position: 'absolute',
  top: 60,
  left: 20,
  right: 20,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 14,

  // shadow (modern card feel)
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },

  elevation: 5,
  zIndex: 1000,
},

notificationContent: {
  flexDirection: 'row',
  alignItems: 'center',
},

notificationText: {
  marginLeft: 10,
  color: '#333',
  fontSize: 14,
  flex: 1,
},

confirmOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
},

confirmContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 10,
},

confirmMessage: {
  fontSize: 16,
  color: '#333',
  marginBottom: 20,
  textAlign: 'center',
},

confirmButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

confirmButtonText: {
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
},

btnText: {
   textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
},

btnTextWhite: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: '600',
},

// Multi-select custom dropdown styles
dropdownToggle: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
},
dropdownList: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  backgroundColor: '#fff',
  marginBottom: 15,
  overflow: 'hidden',
},
dropdownItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
chipContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 10,
  gap: 5,
},
chip: {
  backgroundColor: '#1d50a2',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 15,
  marginRight: 4,
  marginBottom: 4,
},
chipText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
});